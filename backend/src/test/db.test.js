const prisma = require("../config/db");

async function testDB() {
  try {
    const programs = await prisma.program.findMany();
    console.log("✅ Database connected successfully");
    console.log(programs);
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();
