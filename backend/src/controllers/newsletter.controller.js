const prisma = require("../config/db");

/**
 * FACULTY: CREATE NEWSLETTER
 * POST /newsletters
 */
exports.createNewsletter = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const {
      title,
      description,
      month,
      year,
      programId,
      departmentId,
      fileIds = []
    } = req.body;

    if (!title || !month || !year) {
      return res.status(400).json({
        message: "Title, month, and year are required"
      });
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        description,
        month,
        year,
        programId: programId ?? null,
        departmentId: departmentId ?? null,
        createdById: facultyId
      }
    });

    if (fileIds.length > 0) {
      await prisma.uploadedFile.updateMany({
        where: { id: { in: fileIds } },
        data: { newsletterId: newsletter.id }
      });
    }

    res.status(201).json({
      message: "Newsletter created successfully",
      newsletter
    });
  } catch (err) {
    console.error("Create newsletter error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * FACULTY: GET MY NEWSLETTERS
 * GET /newsletters/mine
 * ============================
 */
exports.getMyNewsletters = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const newsletters = await prisma.newsletter.findMany({
      where: {
        createdById: facultyId,
      },
      orderBy: [
        { year: "desc" },
        { month: "desc" },
      ],
      include: {
        files: true,
      },
    });

    res.json(newsletters);
  } catch (error) {
    console.error("Fetch my newsletters error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * STUDENT: GET NEWSLETTERS
 * GET /newsletters
 */
exports.getNewsletters = async (req, res) => {
  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: [
        { year: "desc" },
        { month: "desc" }
      ],
      include: {
        files: true,
        createdBy: { select: { name: true } }
      }
    });

    res.json(newsletters);
  } catch (err) {
    console.error("Fetch newsletters error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
