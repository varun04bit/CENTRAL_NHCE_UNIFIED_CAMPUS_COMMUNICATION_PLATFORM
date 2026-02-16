const { saveUploadedFile } = require("../services/upload.service");

const uploadFile = async (req, res) => {
  try {
    // if (!req.file) {
    //   return res.status(400).json({ message: "File is required" });
    // }

    // const savedFile = await saveUploadedFile(
    //   req.file,
    //   process.env.BASE_URL
    // );

    // res.status(201).json({
    //   message: "File uploaded successfully",
    //   file: savedFile
    // });
    if (!req.files || req.files.length === 0) {
  return res.status(400).json({ message: "At least one file is required" });
}

const savedFiles = await Promise.all(
  req.files.map(file =>
    saveUploadedFile(file, process.env.BASE_URL)
  )
);

res.status(201).json({
  message: "Files uploaded successfully",
  files: savedFiles
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
