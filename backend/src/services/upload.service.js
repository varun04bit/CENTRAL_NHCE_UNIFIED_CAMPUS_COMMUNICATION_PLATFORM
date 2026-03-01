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

const prisma = require("../config/db");
const cloudinary = require("../config/cloudinary");

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

const saveUploadedFile = async (file) => {
  // Upload to cloudinary
  const result = await uploadToCloudinary(file);

  // Save in DB (same table you already use)
  return prisma.uploadedFile.create({
    data: {
      filePath: result.public_id, // cloudinary id instead of local path
      mimeType: file.mimetype,
      size: file.size,
      url: result.secure_url       // permanent file URL
    }
  });
};

module.exports = {
  saveUploadedFile
};