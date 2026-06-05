/*
  Warnings:

  - Added the required column `type` to the `Plat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plat" ADD COLUMN     "type" VARCHAR(50) NOT NULL;
