const prisma = require("../config/db");

async function testDB() {
  try {
    const users = await prisma.user.findMany();
    console.log("✅ Database connected successfully");
    console.log(users);
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();
