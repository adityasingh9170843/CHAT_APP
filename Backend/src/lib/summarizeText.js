import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/philschmid/bart-large-cnn-samsum";

export const summarizeText = async (text) => {
  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data[0]?.summary_text || "No summary available.";
    return summary;
  } catch (error) {
    console.error("Hugging Face summarization error:", error.response?.data || error.message);
    throw new Error("Failed to summarize text.");
  }
};
