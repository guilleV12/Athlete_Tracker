import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/AppError.js";

const TOKEN_BYTES = 32;
const EXPIRY_MS = 60 * 60 * 1000;

const GENERIC_MESSAGE =
  "Si existe una cuenta con ese email, recibirás instrucciones para restablecer la contraseña.";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildResetUrl(token) {
  const base = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}

export async function requestPasswordReset(rawEmail) {
  const email = rawEmail.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { message: GENERIC_MESSAGE };
  }

  const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + EXPIRY_MS);

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  const resetUrl = buildResetUrl(token);

  if (process.env.NODE_ENV !== "production") {
    console.log("[password-reset] Enlace de recuperación:", resetUrl);
  }

  const payload = { message: GENERIC_MESSAGE };

  if (process.env.NODE_ENV !== "production") {
    payload.devResetUrl = resetUrl;
  }

  return payload;
}

export async function resetPasswordWithToken(token, newPassword) {
  if (!token?.trim()) {
    throw new AppError("El enlace no es válido. Pedí uno nuevo.", 400);
  }

  const tokenHash = hashToken(token.trim());
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    if (record) {
      await prisma.passwordResetToken.delete({ where: { id: record.id } });
    }
    throw new AppError(
      "El enlace no es válido o expiró. Pedí uno nuevo desde «Olvidé mi contraseña».",
      400
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({ where: { id: record.id } }),
  ]);

  return {
    message: "Contraseña actualizada. Ya podés iniciar sesión.",
  };
}
