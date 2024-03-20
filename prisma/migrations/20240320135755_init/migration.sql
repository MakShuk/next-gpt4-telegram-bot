-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "telegramId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "maxUsers" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "BotToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "BotToken_token_key" ON "BotToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "BotToken_botName_key" ON "BotToken"("botName");
