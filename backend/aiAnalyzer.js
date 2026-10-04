async function analyzeWithAI(message) {
  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const prompt = `
You are ScamShield, an investor-safety analysis assistant.

Analyze the following financial message for possible:
- investment scams
- fraud
- phishing
- manipulation
- misleading financial claims
- requests for sensitive information
- suspicious payment requests

IMPORTANT SAFETY RULES:

1. Do NOT provide stock recommendations.
2. Do NOT tell the user to buy, sell, or hold any investment.
3. Do NOT predict investment returns.
4. Do NOT claim with certainty that a message is fraudulent.
5. Identify warning indicators only.
6. Explain why each indicator deserves caution.
7. Focus on investor safety and education.
8. Never ask the user to provide OTP, PIN, password, CVV, bank credentials, or other sensitive information.
9. Understand English, Hindi, and Hinglish.
10. Keep explanations simple and understandable for first-time and low-literacy users.

USER MESSAGE:

"${message}"

Return ONLY valid JSON.

Use exactly this structure:

{
  "riskIndicators": [
    {
      "type": "string",
      "reason": "string",
      "evidence": "string"
    }
  ],
  "summary": "string",
  "language": "English"
}

The "language" field must be exactly one of:

"English"
"Hindi"
"Hinglish"

If there are no meaningful warning indicators:

{
  "riskIndicators": [],
  "summary": "No major warning indicators were identified. This does not prove that the message is legitimate.",
  "language": "English"
}

Do not use markdown.
Do not use code fences.
Do not add any text outside the JSON.
`;

  let response;

  // Retry temporary Gemini service errors
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
      });

      break;
    } catch (error) {
  console.log(`Gemini attempt ${attempt} failed`);
  console.log("STATUS:", error.status);
  console.log("MESSAGE:", error.message);
  console.log("ERROR:", error);

      if (attempt === 3) {
        throw error;
      }

      const delay = attempt * 2000;

      await new Promise(resolve =>
        setTimeout(resolve, delay)
      );
    }
  }

  const text = response.text.trim();

  try {
    // Remove accidental markdown code fences if Gemini adds them
    const cleanText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("AI JSON parsing failed:", text);

    return {
      riskIndicators: [],
      summary:
        "AI analysis could not be structured. The rule-based safety analysis remains available.",
      language: "English"
    };
  }
}

module.exports = analyzeWithAI;