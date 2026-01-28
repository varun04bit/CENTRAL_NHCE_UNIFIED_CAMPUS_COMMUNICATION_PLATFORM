require("dotenv").config();

const { generateToken } = require("../utils/jwt");

async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const token = generateToken({
      id: "admin",
      role: "ADMIN",
    });

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  adminLogin,
};
