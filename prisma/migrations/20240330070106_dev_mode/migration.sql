/*
  Warnings:

  - You are about to drop the column `isActivated` on the `BotToken` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BotToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "development" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_BotToken" ("botName", "id", "token") SELECT "botName", "id", "token" FROM "BotToken";
DROP TABLE "BotToken";
ALTER TABLE "new_BotToken" RENAME TO "BotToken";
CREATE UNIQUE INDEX "BotToken_token_key" ON "BotToken"("token");
CREATE UNIQUE INDEX "BotToken_botName_key" ON "BotToken"("botName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
