/*
  Warnings:

  - Added the required column `age` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "age" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "breed" TEXT NOT NULL
);
INSERT INTO "new_Dog" ("breed", "description", "id", "name") SELECT "breed", "description", "id", "name" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
