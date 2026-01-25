const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const prisma = new PrismaClient();

/**
 * STUDENT SIGNUP
 * POST /auth/student/signup
 */
exports.studentSignup = async (req, res) => {
  

  try {
    const { email, password, programId, departmentId, semester } = req.body;
    

    // 1️⃣ Validate input
    if (!email || !password || !programId || !departmentId || !semester) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2️⃣ Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return res.status(409).json({
        message: "Student already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create student
    await prisma.student.create({
      data: {
        email,
        password: hashedPassword,
        semester,
        programId,
        departmentId,
      },
    });

    // 5️⃣ Return success (NO token on signup)
    return res.status(201).json({
      message: "Student registered successfully",
    });
  } catch (error) {
    console.error("Student signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * STUDENT LOGIN
 * POST /auth/student/login
 */
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find student
    const student = await prisma.student.findUnique({
      where: { email },
    });

    console.log("🔍 STUDENT FOUND:", !!student);

    if (!student) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      student.password
    );

    

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Generate JWT
    const token = generateToken({
      id: student.id,
      role: "STUDENT",
    });

    

    // 5️⃣ Return response
    return res.status(200).json({
      token,
      student: {
        id: student.id,
        email: student.email,
        semester: student.semester,
        programId: student.programId,
        departmentId: student.departmentId,
      },
    });
  } catch (error) {
    console.error("Student login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
