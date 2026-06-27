-- CreateEnum
CREATE TYPE "Efficiency" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "avgTime" DOUBLE PRECISION,
ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "efficiency" "Efficiency" NOT NULL DEFAULT 'MEDIA',
ADD COLUMN     "punctuality" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "cargo" DOUBLE PRECISION,
ADD COLUMN     "driver" TEXT,
ADD COLUMN     "fuel" DOUBLE PRECISION,
ADD COLUMN     "kmToday" DOUBLE PRECISION,
ADD COLUMN     "year" INTEGER;
