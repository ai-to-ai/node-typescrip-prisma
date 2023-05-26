-- CreateTable
CREATE TABLE "addresses" (
    "address" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nr" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "addressesAddress" TEXT,
    CONSTRAINT "inscriptions_addressesAddress_fkey" FOREIGN KEY ("addressesAddress") REFERENCES "addresses" ("address") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inscription_id" TEXT NOT NULL,
    "block_id" INTEGER NOT NULL,
    "from_address" TEXT NOT NULL,
    "to_address" TEXT NOT NULL,
    CONSTRAINT "transactions_inscription_id_fkey" FOREIGN KEY ("inscription_id") REFERENCES "inscriptions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
