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

/**
 * FACULTY: UPDATE NEWSLETTER
 * PUT /newsletters/:id
 */
exports.updateNewsletter = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { id } = req.params;
    const { title, description, month, year } = req.body;

    const existing = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    if (existing.createdById !== facultyId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.newsletter.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(month !== undefined ? { month: Number(month) } : {}),
        ...(year !== undefined ? { year: Number(year) } : {}),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update newsletter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
