// require("dotenv").config();

// const { PrismaClient } = require("@prisma/client");
// const { PrismaPg } = require("@prisma/adapter-pg");
// const { Pool } = require("pg");

// // Create PostgreSQL pool (Neon)
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// // Prisma adapter (required in v7)
// const adapter = new PrismaPg(pool);

// // Prisma client
// const prisma = new PrismaClient({
//   adapter
// });

// module.exports = prisma;

// src/config/db.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
