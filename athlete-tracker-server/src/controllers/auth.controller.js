import { createUser, loginUser } from "../services/auth.service.js";
import {
    requestPasswordReset,
    resetPasswordWithToken,
} from "../services/passwordReset.service.js";
import { AppError } from "../lib/AppError.js";

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await createUser({ email, password, name });
        
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const data = await loginUser({ email, password });

        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email?.trim()) {
            throw new AppError("El email es obligatorio", 400);
        }

        const result = await requestPasswordReset(email);
        res.json(result);
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!password) {
            throw new AppError("La contraseña es obligatoria", 400);
        }

        const result = await resetPasswordWithToken(token, password);
        res.json(result);
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ error: error.message });
    }
};

export const me = async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };