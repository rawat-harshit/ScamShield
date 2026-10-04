require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeScamMessage = require("./utils/scamDetector");
const analyzeWithAI = require("./aiAnalyzer");
const analyzeUrl = require("./utils/urlDetector");
const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ScamShield backend is running!"
  });
});


// Analyze message route
app.post("/api/analyze", async (req, res) => {

  const { message } = req.body;

  if (!message || message.trim() === "") {

    return res.status(400).json({
      error: "Message is required"
    });

  }


  try {

    // Rule-based analysis
    const ruleResult = analyzeScamMessage(message);


    // AI analysis
    const aiResult = await analyzeWithAI(message);
    console.log("AI RESULT:", aiResult);


    // Combine both results
    const combinedResult = {

      riskLevel: ruleResult.riskLevel,

      score: ruleResult.score,

      summary: ruleResult.summary,

      signals: ruleResult.signals,

      aiAnalysis: aiResult,

      safeActions: ruleResult.safeActions

    };


    res.json(combinedResult);


  } catch (error) {

    console.error("AI analysis error:", error);

    // If AI fails, still return the rule-based result

    const ruleResult = analyzeScamMessage(message);

    res.json({

      ...ruleResult,

      aiAnalysis: {
        riskIndicators: [],
        summary:
          "AI analysis was temporarily unavailable. The rule-based safety analysis is still available."
      }

    });

  }

});
app.post("/api/analyze-url", (req, res) => {
  const { url } = req.body;

  if (!url || url.trim() === "") {
    return res.status(400).json({
      error: "URL is required"
    });
  }

  try {
    const result = analyzeUrl(url);

    res.json({
      url,
      ...result
    });
  } catch (error) {
    console.error("URL analysis error:", error);

    res.status(500).json({
      error: "Unable to analyze URL"
    });
  }
});


app.listen(PORT, () => {
  console.log(`ScamShield backend running on http://localhost:${PORT}`);
});