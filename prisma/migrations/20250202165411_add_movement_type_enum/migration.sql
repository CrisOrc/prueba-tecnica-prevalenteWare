-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "type" "MovementType" NOT NULL DEFAULT 'INCOME';
