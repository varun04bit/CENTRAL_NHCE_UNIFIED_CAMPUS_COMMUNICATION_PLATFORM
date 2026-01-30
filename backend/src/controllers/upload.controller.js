const { saveUploadedFile } = require("../services/upload.service");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const savedFile = await saveUploadedFile(
      req.file,
      process.env.BASE_URL
    );

    res.status(201).json({
      message: "File uploaded successfully",
      file: savedFile
    });

  } catch (err) {
    res.status(500).json({
      message: "Upload failed",
      error: err.message
    });
  }
};

module.exports = {
  uploadFile
};
