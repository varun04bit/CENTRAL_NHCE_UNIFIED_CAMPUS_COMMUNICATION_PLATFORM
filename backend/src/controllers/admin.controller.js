const bcrypt = require("bcrypt");
const prisma = require("../config/db");

async function createFaculty(req, res) {
  try {
    const { name, email, tempPassword, departmentId } = req.body;

    if (!name || !email || !tempPassword || !departmentId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await prisma.faculty.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        message: "Faculty already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        password: hashedPassword,
        departmentId,
        isFirstLogin: true,
      },
    });

    return res.status(201).json({
      message: "Faculty created successfully",
      facultyId: faculty.id,
    });
  } catch (error) {
    console.error("Create faculty error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  createFaculty,
};
