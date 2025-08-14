-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "enhancedPrompt" TEXT,
ADD COLUMN     "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phase" TEXT NOT NULL DEFAULT 'planning',
ADD COLUMN     "projectDescriptionId" TEXT,
ADD COLUMN     "qualityScore" JSONB;

-- AlterTable
ALTER TABLE "ProjectType" ADD COLUMN     "color" TEXT,
ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'beginner',
ADD COLUMN     "estimatedTime" TEXT,
ADD COLUMN     "subcategory" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "expertise" TEXT NOT NULL DEFAULT 'all',
ADD COLUMN     "phase" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "subcategory" TEXT;

-- CreateTable
CREATE TABLE "ProjectDescription" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "businessGoals" TEXT[],
    "successMetrics" TEXT NOT NULL,
    "constraints" TEXT,
    "timeline" TEXT,
    "budget" TEXT,
    "expertiseLevel" TEXT NOT NULL DEFAULT 'intermediate',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_phase_idx" ON "Project"("phase");

-- CreateIndex
CREATE INDEX "Question_category_phase_idx" ON "Question"("category", "phase");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectDescriptionId_fkey" FOREIGN KEY ("projectDescriptionId") REFERENCES "ProjectDescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
