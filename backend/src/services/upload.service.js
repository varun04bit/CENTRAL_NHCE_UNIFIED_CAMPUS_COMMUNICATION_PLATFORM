import prisma from "../config/prisma.js";

export const saveUploadedFile = async (file, baseUrl) => {
  const url = `${baseUrl}/${file.path.replace(/\\/g, "/")}`;

  return prisma.uploadedFile.create({
    data: {
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
      url
    }
  });
};
