const aiService = require("../services/ai.services.js");

module.exports.getReview = async (req, res) => {
    try {
        console.log("BODY RECEIVED:", req.body);

        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "Prompt (code) is required" });
        }

        // Set streaming headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        // Call streaming service
        await aiService(code, (chunk) => {
            res.write(`data: ${chunk}\n\n`);
        });

        res.write("data: [STREAM_END]\n\n");
        res.end();

    } catch (error) {
        console.error("Stream Error:", error);
        res.write(`data: Error: ${error.message}\n\n`);
        res.end();
    }
};
