const bcrypt = require("bcrypt");
const prisma = require("../config/db");

async function createFaculty(req, res) {
  try {
    const { name, email, tempPassword, departmentId } = req.body;

    if (!name || !email || !tempPassword || !departmentId) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // Check department exists
    const dept = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!dept) {
      return res.status(400).json({ message: "Invalid departmentId" });
    }

    const exists = await prisma.faculty.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(409).json({ message: "Faculty already exists" });
    }

    const hashed = await bcrypt.hash(tempPassword, 10);

    const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        password: hashed,
        departmentId,
        isFirstLogin: true,
      },
    });

    res.status(201).json({
      message: "Faculty created",
      facultyId: faculty.id,
    });
  } catch (err) {
    console.error("Create faculty error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createFaculty };
