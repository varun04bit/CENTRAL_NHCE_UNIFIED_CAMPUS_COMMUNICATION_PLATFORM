

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔥 UNIFIED LOGIN HIT:", email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // =========================
    // 1️⃣ CHECK FACULTY FIRST
    // =========================
    const faculty = await prisma.faculty.findUnique({
      where: { email },
    });

    if (faculty) {
      const isValid = await bcrypt.compare(password, faculty.password);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({
        id: faculty.id,
        role: "FACULTY",
      });

      console.log(
        "✅ FACULTY LOGIN",
        faculty.email,
        "FIRST LOGIN:",
        faculty.isFirstLogin
      );

      return res.status(200).json({
        token,
        role: "FACULTY",
        requiresPasswordChange: faculty.isFirstLogin,
        user: {
          id: faculty.id,
          name: faculty.name,
          email: faculty.email,
        },
      });
    }

    // =========================
    // 2️⃣ CHECK STUDENT
    // =========================
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, student.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: student.id,
      role: "STUDENT",
    });

    console.log("✅ STUDENT LOGIN", student.email);

    return res.status(200).json({
      token,
      role: "STUDENT",
      user: {
        id: student.id,
        email: student.email,
        semester: student.semester,
        programId: student.programId,
        departmentId: student.departmentId,
      },
    });
  } catch (error) {
    console.error("❌ UNIFIED LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
