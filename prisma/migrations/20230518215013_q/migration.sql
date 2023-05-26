/*
  Warnings:

  - Added the required column `content_type` to the `inscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content_type" TEXT NOT NULL,
    "nr" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "addressesAddress" TEXT,
    CONSTRAINT "inscriptions_addressesAddress_fkey" FOREIGN KEY ("addressesAddress") REFERENCES "addresses" ("address") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_inscriptions" ("address", "addressesAddress", "id", "nr") SELECT "address", "addressesAddress", "id", "nr" FROM "inscriptions";
DROP TABLE "inscriptions";
ALTER TABLE "new_inscriptions" RENAME TO "inscriptions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
