import { getAchievementsCatalog } from "../services/achievement.service.js";

export const getCatalog = async (req, res) => {
  try {
    const data = await getAchievementsCatalog(req.user.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
