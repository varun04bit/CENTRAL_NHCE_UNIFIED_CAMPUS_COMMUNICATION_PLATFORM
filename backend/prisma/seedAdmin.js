const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be in .env");
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      password: hashed,
    },
  });

  console.log("Admin seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());