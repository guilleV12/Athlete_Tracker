/**
 * Aplica migraciones SQL locales a Turso (Prisma CLI no puede hacer push remoto).
 * Uso: npm run db:sync:turso  (requiere TURSO_* en .env)
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "../prisma/migrations");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("[sync-turso] Faltan TURSO_DATABASE_URL o TURSO_AUTH_TOKEN en .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function runMigrations() {
  const entries = await readdir(migrationsDir, { withFileTypes: true });
  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  for (const folder of folders) {
    const sqlPath = path.join(migrationsDir, folder, "migration.sql");
    let sql;
    try {
      sql = await readFile(sqlPath, "utf8");
    } catch {
      continue;
    }

    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(`[sync-turso] ${folder} (${statements.length} statements)`);

    for (const statement of statements) {
      try {
        await client.execute(statement);
      } catch (err) {
        const msg = String(err.message ?? err);
        if (/already exists|duplicate column|UNIQUE constraint failed/i.test(msg)) {
          continue;
        }
        throw err;
      }
    }
  }
}

await runMigrations();
console.log("[sync-turso] Migraciones aplicadas.");
await client.close();
