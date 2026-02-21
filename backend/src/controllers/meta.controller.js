const prisma = require("../config/db");

/**
 * GET /meta/programs
 */
exports.getPrograms = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { name: "asc" },
    });

    res.json(programs);
  } catch (error) {
    console.error("Get programs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /meta/departments/:programId
 */
exports.getDepartmentsByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const departments = await prisma.department.findMany({
      where: { programId },
      orderBy: { name: "asc" },
    });

    res.json(departments);
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
