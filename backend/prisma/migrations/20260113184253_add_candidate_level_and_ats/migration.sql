/*
  Warnings:

  - You are about to drop the column `atsAnalysis` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `professionalArea` on the `analyses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "atsAnalysis",
DROP COLUMN "professionalArea",
ADD COLUMN     "atsScore" DOUBLE PRECISION;
