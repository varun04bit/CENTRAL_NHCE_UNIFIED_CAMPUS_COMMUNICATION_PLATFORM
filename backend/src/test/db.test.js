const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function test() {
  const programs = await prisma.program.findMany({
    include: { departments: true },
  });

  console.log(JSON.stringify(programs, null, 2));
}

test();
