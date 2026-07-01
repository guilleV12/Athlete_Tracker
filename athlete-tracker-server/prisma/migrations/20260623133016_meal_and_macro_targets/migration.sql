-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN "targetCarbsG" INTEGER;
ALTER TABLE "UserProfile" ADD COLUMN "targetFatG" INTEGER;
ALTER TABLE "UserProfile" ADD COLUMN "targetProteinG" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "proteinG" INTEGER NOT NULL DEFAULT 0,
    "carbsG" INTEGER NOT NULL DEFAULT 0,
    "fatG" INTEGER NOT NULL DEFAULT 0,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Meal" ("calories", "date", "id", "type", "userId") SELECT "calories", "date", "id", "type", "userId" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
