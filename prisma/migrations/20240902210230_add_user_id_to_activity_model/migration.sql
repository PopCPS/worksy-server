/*
  Warnings:

  - Added the required column `user_id` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agenda_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "occurs_at" DATETIME NOT NULL,
    CONSTRAINT "activities_agenda_id_fkey" FOREIGN KEY ("agenda_id") REFERENCES "agenda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_activities" ("agenda_id", "date", "id", "is_done", "occurs_at", "title") SELECT "agenda_id", "date", "id", "is_done", "occurs_at", "title" FROM "activities";
DROP TABLE "activities";
ALTER TABLE "new_activities" RENAME TO "activities";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
