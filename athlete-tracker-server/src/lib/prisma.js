import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;

  if (isProd) {
    if (!tursoUrl || !tursoToken) {
      throw new Error(
        "Faltan TURSO_DATABASE_URL o TURSO_AUTH_TOKEN. Configuralas en Vercel → Settings → Environment Variables."
      );
    }
    return new PrismaClient({
      adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }),
      log: ["error"],
    });
  }

  if (tursoUrl && tursoToken) {
    return new PrismaClient({
      adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }),
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** @type {PrismaClient} */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
