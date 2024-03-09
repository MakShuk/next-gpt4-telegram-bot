/*
  Warnings:

  - Added the required column `botName` to the `BotToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BotToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_BotToken" ("id", "status", "token") SELECT "id", "status", "token" FROM "BotToken";
DROP TABLE "BotToken";
ALTER TABLE "new_BotToken" RENAME TO "BotToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
