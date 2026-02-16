

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

/**
 * POST /auth/faculty/update-password
 * (Faculty only, JWT protected)
 */
exports.updateFacultyPassword = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.faculty.update({
      where: { id: facultyId },
      data: {
        password: hashedPassword,
        isFirstLogin: false,
      },
    });

    console.log("🔐 FACULTY PASSWORD UPDATED:", facultyId);

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("❌ UPDATE PASSWORD ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
