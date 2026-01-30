const prisma = require("../config/db");

/**
 * ============================
 * FACULTY: CREATE ANNOUNCEMENT
 * POST /announcements
 * ============================
 */
exports.createAnnouncement = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { title, description, priority, semester, uploadedFileId } = req.body;

    // Basic validation
    if (!title || !description || !priority) {
      return res.status(400).json({
        message: "Title, description, and priority are required",
      });
    }

    // Fetch faculty to derive department & program
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        department: true,
      },
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found",
      });
    }

    // Create announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        priority,
        semester: semester ?? null,

        facultyId,
        departmentId: faculty.departmentId,
        programId: faculty.department.programId,

        uploadedFileId: uploadedFileId ?? null
      },
    });

    return res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error("❌ Create announcement error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * ============================
 * STUDENT: GET ANNOUNCEMENTS
 * GET /announcements
 * ============================
 */
// 
exports.getStudentAnnouncements = async (req, res) => {
  try {
    const studentId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: {
          programId: student.programId,
          departmentId: student.departmentId,
          AND: [
            {
              OR: [
                { semester: student.semester },
                { semester: null },
              ],
            },
            {
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
              ],
            },
          ],
        },
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
        include: {
          faculty: { select: { name: true } },
          uploadedFile: true,
        },
      }),

      prisma.announcement.count({
        where: {
          programId: student.programId,
          departmentId: student.departmentId,
        },
      }),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      announcements,
    });
  } catch (error) {
    console.error("Fetch announcements error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.announcement.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (existing.facultyId !== facultyId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    console.error("Update announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({ where: { id } });

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (announcement.facultyId !== facultyId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.announcement.delete({ where: { id } });

    res.json({ message: "Announcement deleted" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

