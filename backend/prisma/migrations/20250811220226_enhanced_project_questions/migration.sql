/*
  Warnings:

  - You are about to drop the column `enhancedPrompt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `phase` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectDescriptionId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `qualityScore` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `ProjectType` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `ProjectType` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `ProjectType` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `ProjectType` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `ProjectDescription` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'RANGE';
ALTER TYPE "QuestionType" ADD VALUE 'PHASE_SELECTOR';

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectDescriptionId_fkey";

-- DropIndex
DROP INDEX "Project_phase_idx";

-- DropIndex
DROP INDEX "Question_category_phase_idx";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "enhancedPrompt",
DROP COLUMN "lastAccessedAt",
DROP COLUMN "phase",
DROP COLUMN "projectDescriptionId",
DROP COLUMN "qualityScore",
ADD COLUMN     "businessGoals" JSONB,
ADD COLUMN     "constraints" TEXT,
ADD COLUMN     "projectOverview" TEXT,
ADD COLUMN     "successMetrics" TEXT,
ADD COLUMN     "targetAudience" TEXT;

-- AlterTable
ALTER TABLE "ProjectType" DROP COLUMN "color",
DROP COLUMN "difficulty",
DROP COLUMN "estimatedTime",
DROP COLUMN "subcategory";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "expertise",
DROP COLUMN "priority",
DROP COLUMN "subcategory",
ADD COLUMN     "phaseOrder" INTEGER;

-- DropTable
DROP TABLE "ProjectDescription";

-- CreateIndex
CREATE INDEX "Question_projectTypeId_phase_phaseOrder_idx" ON "Question"("projectTypeId", "phase", "phaseOrder");
