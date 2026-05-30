import {
  getUserProfile,
  upsertUserProfile,
  logUserWeight,
} from "../services/profile.service.js";

export const getProfile = async (req, res) => {
  try {
    const data = await getUserProfile(req.user.userId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const data = await upsertUserProfile(req.user.userId, req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logWeight = async (req, res) => {
  try {
    const data = await logUserWeight(req.user.userId, req.body.weightKg);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
