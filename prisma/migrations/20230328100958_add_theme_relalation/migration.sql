/*
  Warnings:

  - You are about to drop the column `theme` on the `UserSettings` table. All the data in the column will be lost.
  - Added the required column `themeId` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "primary" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "accent2" TEXT NOT NULL,
    "mood" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "language" TEXT,
    "layout" TEXT,
    "notifications" BOOLEAN,
    "privacy" TEXT,
    "accessibility" TEXT,
    "themeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserSettings_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserSettings" ("accessibility", "id", "language", "layout", "notifications", "privacy", "userId") SELECT "accessibility", "id", "language", "layout", "notifications", "privacy", "userId" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
