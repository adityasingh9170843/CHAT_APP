import express from "express";
import { summarizeText } from "../lib/summarizeText.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const chatText = messages.map((msg) => msg.text).join(" ");
    const summary = await summarizeText(chatText);

    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error.message);
    res.status(500).json({ error: "Failed to summarize messages" });
  }
});

export default router;
