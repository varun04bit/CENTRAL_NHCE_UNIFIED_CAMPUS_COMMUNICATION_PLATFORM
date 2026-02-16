

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

/**
 * POST /auth/student/signup
 */
exports.studentSignup = async (req, res) => {
  try {
    const { email, password, programId, departmentId, semester } = req.body;

    if (!email || !password || !programId || !departmentId || !semester) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return res.status(409).json({
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.student.create({
      data: {
        email,
        password: hashedPassword,
        semester,
        programId,
        departmentId,
      },
    });

    console.log("✅ STUDENT SIGNUP:", email);

    return res.status(201).json({
      message: "Student registered successfully",
    });
  } catch (error) {
    console.error("❌ STUDENT SIGNUP ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
