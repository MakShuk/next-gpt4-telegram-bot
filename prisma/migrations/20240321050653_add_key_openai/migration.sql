-- CreateTable
CREATE TABLE "OpenAIKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenAIKey_key_key" ON "OpenAIKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "OpenAIKey_name_key" ON "OpenAIKey"("name");
