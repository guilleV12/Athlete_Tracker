import { PrismaClient } from "@prisma/client";
import { ACHIEVEMENT_DEFINITIONS } from "../src/lib/achievements/definitions.js";

const prisma = new PrismaClient();

async function main() {
  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    const existing = await prisma.achievement.findFirst({
      where: { condition: achievement.condition },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: {
          name: achievement.name,
          description: achievement.description,
          sortOrder: achievement.sortOrder,
          category: achievement.category,
        },
      });
    } else {
      await prisma.achievement.create({ data: achievement });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
