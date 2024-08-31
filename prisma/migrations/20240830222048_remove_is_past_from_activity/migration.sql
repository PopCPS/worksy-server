/*
  Warnings:

  - You are about to drop the column `isPast` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `trip_id` on the `activities` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL,
    "occurs_at" DATETIME NOT NULL,
    CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_activities" ("id", "isDone", "occurs_at", "title") SELECT "id", "isDone", "occurs_at", "title" FROM "activities";
DROP TABLE "activities";
ALTER TABLE "new_activities" RENAME TO "activities";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
