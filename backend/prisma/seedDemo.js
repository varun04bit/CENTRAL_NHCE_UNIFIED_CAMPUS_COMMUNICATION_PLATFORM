require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Demo Data for Interview...");

  // 1. Ensure BE -> CSE exists
  const be = await prisma.program.upsert({
    where: { name: "BE" },
    update: {},
    create: { name: "BE" },
  });

  const cse = await prisma.department.upsert({
    where: { name_programId: { name: "CSE", programId: be.id } },
    update: {},
    create: { name: "CSE", programId: be.id },
  });

  // 2. Demo Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@college.edu";
  const adminPass = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminHash = await bcrypt.hash(adminPass, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: adminHash },
  });

  // 3. Ready-to-demo Faculty (isFirstLogin: false so it opens dashboard directly)
  const facultyHash = await bcrypt.hash("Faculty@123", 10);
  const demoFaculty = await prisma.faculty.upsert({
    where: { email: "faculty@college.edu" },
    update: {},
    create: {
      name: "Prof. Demo Faculty",
      email: "faculty@college.edu",
      password: facultyHash,
      isFirstLogin: false,
      departmentId: cse.id,
    },
  });

  // 4. Ready-to-demo Student (BE -> CSE, Semester 6)
  const studentHash = await bcrypt.hash("Student@123", 10);
  await prisma.student.upsert({
    where: { email: "student@college.edu" },
    update: {},
    create: {
      email: "student@college.edu",
      password: studentHash,
      semester: 6,
      programId: be.id,
      departmentId: cse.id,
    },
  });

  // 5. Sample Announcements (only create if none exist for demoFaculty)
  const existingAnnouncements = await prisma.announcement.count({
    where: { facultyId: demoFaculty.id },
  });

  if (existingAnnouncements === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: "Mid-Semester Exam Schedule Released",
          description:
            "The timetable for 6th semester CIE-2 exams has been finalized. Exams begin next Monday at 9:30 AM in Block A.",
          priority: "PINNED",
          semester: 6,
          facultyId: demoFaculty.id,
          departmentId: cse.id,
          programId: be.id,
        },
        {
          title: "Campus Placement Drive: TechCorp & CloudNine",
          description:
            "Pre-placement talk starts at 10:00 AM in the Main Auditorium. Carry two copies of your updated resume and college ID.",
          priority: "HIGH",
          semester: null,
          facultyId: demoFaculty.id,
          departmentId: cse.id,
          programId: be.id,
        },
        {
          title: "AI & Full-Stack Workshop This Friday",
          description:
            "Hands-on session on building production mobile and web apps in CSE Seminar Hall 2 from 2:00 PM to 5:00 PM.",
          priority: "INFO",
          semester: null,
          facultyId: demoFaculty.id,
          departmentId: cse.id,
          programId: be.id,
        },
      ],
    });
  }

  // 6. Sample Newsletter
  const existingNewsletter = await prisma.newsletter.findFirst({
    where: {
      month: 11,
      year: 2026,
      programId: null,
      departmentId: null,
    },
  });

  if (!existingNewsletter) {
    await prisma.newsletter.create({
      data: {
        title: "Department of CSE — Monthly Digest",
        description:
          "Highlights from hackathons, student research publications, placement milestones, and upcoming tech events.",
        month: 11,
        year: 2026,
        createdById: demoFaculty.id,
      },
    });
  }

  console.log("✅ Demo seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Demo seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

