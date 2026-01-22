require("dotenv").config();

const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/jwt");

const prisma = new PrismaClient();

/**
 * ======================================================
 * FACULTY LOGIN
 * POST /auth/faculty/login
 * ======================================================
 */
async function facultyLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find faculty
    const faculty = await prisma.faculty.findUnique({
      where: { email },
    });

    if (!faculty) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      faculty.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = generateToken({
      id: faculty.id,
      role: "FACULTY",
    });

    return res.status(200).json({
      token,
      requiresPasswordChange: faculty.isFirstLogin,
      faculty: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
      },
    });
  } catch (error) {
    console.error("Faculty Login Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * ======================================================
 * FACULTY UPDATE PASSWORD (FIRST LOGIN)
 * POST /auth/faculty/update-password
 * ======================================================
 */
async function updateFacultyPassword(req, res) {
  try {
    const facultyId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update faculty record
    await prisma.faculty.update({
      where: { id: facultyId },
      data: {
        password: hashedPassword,
        isFirstLogin: false,
      },
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update Password Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  facultyLogin,
  updateFacultyPassword,
};
