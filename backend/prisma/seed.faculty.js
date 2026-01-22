require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Faculty Accounts...");

  // Temporary default password (faculty will change on first login)
  const tempPassword = "Faculty@123";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Get departments we want to attach faculty to
  const cse = await prisma.department.findFirst({
    where: {
      name: "CSE",
      program: { name: "BE" },
    },
  });

  const aiml = await prisma.department.findFirst({
    where: {
      name: "AIML",
      program: { name: "BE" },
    },
  });

  const mbaFinance = await prisma.department.findFirst({
    where: {
      name: "Finance",
      program: { name: "MBA" },
    },
  });

  if (!cse || !aiml || !mbaFinance) {
    throw new Error("Required departments not found. Run master seed first.");
  }

  const faculties = [
    {
      name: "Dr. Rajesh Kumar",
      email: "rajesh.cse@college.edu",
      departmentId: cse.id,
    },
    {
      name: "Dr. Ananya Sharma",
      email: "ananya.aiml@college.edu",
      departmentId: aiml.id,
    },
    {
      name: "Prof. Suresh Iyer",
      email: "suresh.finance@college.edu",
      departmentId: mbaFinance.id,
    },
  ];

  for (const faculty of faculties) {
    await prisma.faculty.upsert({
      where: { email: faculty.email },
      update: {},
      create: {
        ...faculty,
        password: hashedPassword,
        isFirstLogin: true,
      },
    });
  }

  console.log("✅ Faculty seeding completed");
  console.log("🔑 Temporary password for all faculty:", tempPassword);
}

main()
  .catch((e) => {
    console.error("❌ Faculty seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
