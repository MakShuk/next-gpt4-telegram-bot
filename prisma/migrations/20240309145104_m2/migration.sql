/*
  Warnings:

  - You are about to drop the column `status` on the `BotToken` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BotToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_BotToken" ("botName", "id", "token") SELECT "botName", "id", "token" FROM "BotToken";
DROP TABLE "BotToken";
ALTER TABLE "new_BotToken" RENAME TO "BotToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
