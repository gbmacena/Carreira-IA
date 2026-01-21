-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "overallScore" DOUBLE PRECISION,
ADD COLUMN     "scores" JSONB;
