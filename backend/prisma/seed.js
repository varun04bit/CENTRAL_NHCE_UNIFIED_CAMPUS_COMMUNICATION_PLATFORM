const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const prisma = new PrismaClient();



async function main() {
  console.log("🌱 Seeding Programs & Departments...");

  // 1️⃣ Programs
  const programs = [
    { name: "BE" },
    { name: "BBA" },
    { name: "BCOM" },
    { name: "MTECH" },
    { name: "MBA" },
    { name: "MCOM" },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { name: program.name },
      update: {},
      create: program,
    });
  }

  // Fetch program IDs
  const be = await prisma.program.findUnique({ where: { name: "BE" } });
  const bba = await prisma.program.findUnique({ where: { name: "BBA" } });
  const bcom = await prisma.program.findUnique({ where: { name: "BCOM" } });
  const mtech = await prisma.program.findUnique({ where: { name: "MTECH" } });
  const mba = await prisma.program.findUnique({ where: { name: "MBA" } });
  const mcom = await prisma.program.findUnique({ where: { name: "MCOM" } });

  // 2️⃣ Departments
  const departments = [
    // ===== BE =====
    { name: "MECH", programId: be.id },
    { name: "EEE", programId: be.id },
    { name: "ECE", programId: be.id },
    { name: "CSE", programId: be.id },
    { name: "AIML", programId: be.id },
    { name: "DS", programId: be.id },
    { name: "ISE", programId: be.id },

    // ===== BBA =====
    { name: "General Management", programId: bba.id },
    { name: "Finance", programId: bba.id },
    { name: "Marketing", programId: bba.id },
    { name: "HR", programId: bba.id },

    // ===== BCOM =====
    { name: "General", programId: bcom.id },
    { name: "Accounting", programId: bcom.id },
    { name: "Finance", programId: bcom.id },

    // ===== MTECH =====
    { name: "Computer Science", programId: mtech.id },
    { name: "VLSI Design", programId: mtech.id },
    { name: "Power Systems", programId: mtech.id },
    { name: "Structural Engineering", programId: mtech.id },

    // ===== MBA =====
    { name: "Finance", programId: mba.id },
    { name: "HR", programId: mba.id },
    { name: "Marketing", programId: mba.id },
    { name: "Operations", programId: mba.id },

    // ===== MCOM =====
    { name: "General", programId: mcom.id },
    { name: "Finance", programId: mcom.id },
    { name: "Accounting", programId: mcom.id },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: {
        name_programId: {
          name: dept.name,
          programId: dept.programId,
        },
      },
      update: {},
      create: dept,
    });
  }

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
