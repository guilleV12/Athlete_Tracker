-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "birthDate" DATETIME NOT NULL,
    "sex" TEXT NOT NULL,
    "weightKg" REAL NOT NULL,
    "heightCm" REAL NOT NULL,
    "activityLevel" TEXT NOT NULL,
    "nutritionMode" TEXT NOT NULL,
    "bmr" INTEGER,
    "tdee" INTEGER,
    "targetCalories" INTEGER,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
