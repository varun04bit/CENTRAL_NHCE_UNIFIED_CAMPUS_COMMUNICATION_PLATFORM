-- CreateSchema
CREATE SCHEMA
IF
  NOT EXISTS "public";

  -- CreateEnum
  CREATE TYPE "Priority" AS ENUM ('PINNED', 'HIGH', 'INFO');

  -- CreateTable
  CREATE TABLE "Program" (
    "id" TEXT NOT NULL
    , "name" TEXT NOT NULL
    , "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    , CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
  );

  -- CreateTable
  CREATE TABLE "Department" (
    "id" TEXT NOT NULL
    , "name" TEXT NOT NULL
    , "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    , "programId" TEXT NOT NULL
    , CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
  );

  -- CreateTable
  CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL
    , "name" TEXT NOT NULL
    , "email" TEXT NOT NULL
    , "password" TEXT NOT NULL
    , "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    , "isFirstLogin" BOOLEAN NOT NULL DEFAULT true
    , "updatedAt" TIMESTAMP(3) NOT NULL
    , "departmentId" TEXT NOT NULL
    , CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
  );

  -- CreateTable
  CREATE TABLE "Student" (
    "id" TEXT NOT NULL
    , "email" TEXT NOT NULL
    , "password" TEXT NOT NULL
    , "semester" INTEGER NOT NULL
    , "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    , "programId" TEXT NOT NULL
    , "departmentId" TEXT NOT NULL
    , CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
  );

  -- CreateTable
  CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL
    , "title" TEXT NOT NULL
    , "description" TEXT NOT NULL
    , "attachment" TEXT
    , "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    , "expiresAt" TIMESTAMP(3)
    , "departmentId" TEXT NOT NULL
    , "facultyId" TEXT NOT NULL
    , "priority" "Priority" NOT NULL
    , "programId" TEXT NOT NULL
    , "semester" INTEGER
    , "updatedAt" TIMESTAMP(3) NOT NULL
    , CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
  );

  -- CreateIndex
  CREATE UNIQUE INDEX "Program_name_key"
  ON "Program"("name");

  -- CreateIndex
  CREATE UNIQUE INDEX "Department_name_programId_key"
  ON "Department"("name", "programId");

  -- CreateIndex
  CREATE UNIQUE INDEX "Faculty_email_key"
  ON "Faculty"("email");

  -- CreateIndex
  CREATE UNIQUE INDEX "Student_email_key"
  ON "Student"("email");

  -- CreateIndex
  CREATE INDEX "Announcement_priority_idx"
  ON "Announcement"("priority");

  -- CreateIndex
  CREATE INDEX "Announcement_expiresAt_idx"
  ON "Announcement"("expiresAt");

  -- AddForeignKey
  ALTER TABLE "Department"
  ADD CONSTRAINT "Department_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id")
  ON DELETE RESTRICT
  ON
  UPDATE
    CASCADE;

  -- AddForeignKey
  ALTER TABLE "Faculty"
  ADD CONSTRAINT "Faculty_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id")
  ON DELETE RESTRICT
  ON
  UPDATE
    CASCADE;

  -- AddForeignKey
  ALTER TABLE "Student"
  ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id")
  ON DELETE RESTRICT
  ON
  UPDATE
    CASCADE;

  -- AddForeignKey
  ALTER TABLE "Student"
  ADD CONSTRAINT "Student_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id")
  ON DELETE RESTRICT
  ON
  UPDATE
    CASCADE;

  -- AddForeignKey
  ALTER TABLE "Announcement"
  ADD CONSTRAINT "Announcement_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id")
  ON DELETE RESTRICT
  ON
  UPDATE
    CASCADE;

  -- AddForeignKey
  ALTER TABLE "Announcement"
  ADD CONSTRAINT "Announcement_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id")
  ON DELETE RESTRICT
  ON
  UPDATE
    CASCADE;

  -- AddForeignKey
  ALTER TABLE "Announcement"
  ADD CONSTRAINT "Announcement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id")
  ON DELETE RESTRICT
  ON
  UPDATE
    CASCADE;