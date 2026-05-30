import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "El email es obligatorio")
  .email("Ingresá un email válido");

const passwordLoginSchema = z
  .string()
  .min(1, "La contraseña es obligatoria");

const passwordRegisterSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .max(72, "Máximo 72 caracteres")
  .regex(/[A-Za-z]/, "Debe incluir al menos una letra")
  .regex(/[0-9]/, "Debe incluir al menos un número");

function personNameSchema(fieldLabel) {
  return z
    .string()
    .trim()
    .min(2, `${fieldLabel} debe tener al menos 2 caracteres`)
    .max(40, `${fieldLabel}: máximo 40 caracteres`)
    .regex(
      /^[\p{L}\s'.-]+$/u,
      `${fieldLabel}: solo letras, espacios, apóstrofes o guiones`
    );
}

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordLoginSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordRegisterSchema,
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

export const registerSchema = z
  .object({
    firstName: personNameSchema("El nombre completo"),
    lastName: personNameSchema("El apellido"),
    email: emailSchema,
    password: passwordRegisterSchema,
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
  })
  .superRefine((data, ctx) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    if (fullName.length > 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lastName"],
        message: "Nombre y apellido juntos no pueden superar 80 caracteres",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

export function toRegisterPayload({ firstName, lastName, email, password }) {
  return {
    name: `${firstName.trim()} ${lastName.trim()}`.replace(/\s+/g, " "),
    email,
    password,
  };
}
