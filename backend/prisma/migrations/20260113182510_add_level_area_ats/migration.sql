-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "atsAnalysis" JSONB,
ADD COLUMN     "candidateLevel" TEXT,
ADD COLUMN     "professionalArea" TEXT;
