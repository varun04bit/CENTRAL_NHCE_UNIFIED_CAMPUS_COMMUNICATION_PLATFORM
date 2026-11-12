// const prisma = require("../config/db");

// const saveUploadedFile = async (file, baseUrl) => {
//   const url = `${baseUrl}/${file.path.replace(/\\/g, "/")}`;

//   return prisma.uploadedFile.create({
//     data: {
//       filePath: file.path,
//       mimeType: file.mimetype,
//       size: file.size,
//       url
//     }
//   });
// };

// module.exports = {
//   saveUploadedFile
// };

const fs = require("fs");
const path = require("path");
const prisma = require("../config/db");
const cloudinary = require("../config/cloudinary");

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "announcements",
        resource_type: "auto"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

const saveLocally = (file) => {
  const uploadDir = path.join(__dirname, "../../uploads/announcements");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname || "") || "";
  const filename = `${unique}${ext}`;
  const fullPath = path.join(uploadDir, filename);
  fs.writeFileSync(fullPath, file.buffer);
  return {
    filePath: `uploads/announcements/${filename}`,
    url: `uploads/announcements/${filename}`,
  };
};

const saveUploadedFile = async (file) => {
  if (hasCloudinary) {
    const result = await uploadToCloudinary(file);
    return prisma.uploadedFile.create({
      data: {
        filePath: result.public_id,
        mimeType: file.mimetype,
        size: file.size,
        url: result.secure_url,
      },
    });
  }

  const local = saveLocally(file);
  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
  const fullUrl = baseUrl ? `${baseUrl}/${local.url}` : local.url;

  return prisma.uploadedFile.create({
    data: {
      filePath: local.filePath,
      mimeType: file.mimetype,
      size: file.size,
      url: fullUrl,
    },
  });
};

module.exports = {
  saveUploadedFile
};