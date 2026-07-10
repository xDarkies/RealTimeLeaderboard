/*
  Warnings:

  - Added the required column `game` to the `scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scores" ADD COLUMN     "game" TEXT NOT NULL;
