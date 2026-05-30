import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { isProfileCompleted } from "./profile.service.js";

export const createUser = async ({ email, password, name }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email: normalizedEmail,
            password: hashedPassword,
            name: name.trim(),
        },
    });

    const profileCompleted = await isProfileCompleted(user.id);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        profileCompleted,
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"},
    );

    const profileCompleted = await isProfileCompleted(user.id);

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profileCompleted,
        },
    };
};

