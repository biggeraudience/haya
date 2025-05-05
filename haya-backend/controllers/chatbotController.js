const axios = require("axios");
const { processComplexQuery } = require("../services/queryOrchestrator");

const processChatQuery = async (req, res) => {
  try {
    const { query, sessionId } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required." });

    // Call the advanced NLP service to parse the query into structured intents
    const nlpResponse = await axios.post("http://localhost:5002/parse_query", { query });
    const parsed = nlpResponse.data;
    console.log("Advanced NLP response:", parsed);

    // If multiple intents are detected, process them via the query orchestrator
    if (parsed.intents && parsed.intents.length > 1) {
      const result = await processComplexQuery(parsed);
      return res.json(result);
    } else if (parsed.intents && parsed.intents.length === 1) {
      // For single-intent queries that we cannot fully handle, delegate to GPT-J for a free-form response.
      const gptJResponse = await axios.post("http://localhost:5003/generate", { prompt: query });
      return res.json({ message: gptJResponse.data.response });
    } else {
      // Fallback if no intent is detected
      return res.json({ message: "I didn't quite catch that. Could you rephrase your question?" });
    }
  } catch (error) {
    console.error("Error processing chat query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { processChatQuery };
