/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `BotToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[botName]` on the table `BotToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BotToken_token_key" ON "BotToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "BotToken_botName_key" ON "BotToken"("botName");
