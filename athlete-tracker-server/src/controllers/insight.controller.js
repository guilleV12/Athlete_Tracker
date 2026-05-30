import { generateInsights } from "../services/insight.service.js";

export const getInsights = async (req, res) => {
    try {
        const insights = await generateInsights(req.user.userId);

        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};