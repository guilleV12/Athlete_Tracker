import { getDashboardStats } from "../services/stats.service.js";

export const getDashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats(req.user.userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};