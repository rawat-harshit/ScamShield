function analyzeUrl(url) {
  const text = url.trim().toLowerCase();

  let score = 0;
  const signals = [];

  // 1. HTTPS check
  if (!text.startsWith("https://")) {
    score += 20;

    signals.push({
      type: "No HTTPS",
      severity: "medium",
      evidence: "URL does not use HTTPS",
      explanation:
        "The link does not use HTTPS. Avoid entering sensitive information on websites without secure connections."
    });
  }

  // 2. IP address instead of domain
  const ipPattern =
    /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}/i;

  if (ipPattern.test(text)) {
    score += 25;

    signals.push({
      type: "IP Address URL",
      severity: "high",
      evidence: "The link uses an IP address instead of a normal domain name.",
      explanation:
        "Fraudulent or temporary websites may use raw IP addresses instead of recognizable domain names."
    });
  }

  // 3. Suspicious words in URL
  const suspiciousWords = [
    "login",
    "verify",
    "verification",
    "secure",
    "account",
    "update",
    "refund",
    "reward",
    "prize",
    "bonus",
    "investment",
    "profit",
    "claim",
    "urgent",
    "wallet"
  ];

  const matchedWords = suspiciousWords.filter(word =>
    text.includes(word)
  );

  if (matchedWords.length >= 2) {
    score += 20;

    signals.push({
      type: "Suspicious URL Keywords",
      severity: "medium",
      evidence: matchedWords.join(", "),
      explanation:
        "The URL contains multiple words commonly associated with account verification, rewards, urgent actions, or financial activity."
    });
  }

  // 4. Very long URL
  if (text.length > 100) {
    score += 15;

    signals.push({
      type: "Unusually Long URL",
      severity: "low",
      evidence: `${text.length} characters`,
      explanation:
        "Very long URLs can sometimes be used to hide suspicious paths or tracking parameters."
    });
  }

  // 5. Many subdomains
  try {
    const parsedUrl = new URL(text);
    const hostnameParts = parsedUrl.hostname.split(".");

    if (hostnameParts.length >= 4) {
      score += 15;

      signals.push({
        type: "Multiple Subdomains",
        severity: "medium",
        evidence: parsedUrl.hostname,
        explanation:
          "The domain contains several subdomains. This is not proof of fraud, but it can make the actual website identity harder to recognize."
      });
    }
  } catch {
    score += 30;

    signals.push({
      type: "Invalid URL",
      severity: "high",
      evidence: url,
      explanation:
        "The provided text does not appear to be a valid URL."
    });
  }

  score = Math.min(score, 100);

  let riskLevel;

  if (score >= 60) {
    riskLevel = "high";
  } else if (score >= 30) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  let summary;

  if (riskLevel === "high") {
    summary =
      "The URL contains multiple characteristics that may require additional caution. Avoid entering sensitive information until the destination is independently verified.";
  } else if (riskLevel === "medium") {
    summary =
      "The URL contains some characteristics that deserve caution. Verify the website and organization independently before taking action.";
  } else {
    summary =
      "No major suspicious URL characteristics were detected. This does not prove that the website is legitimate.";
  }

  return {
    riskLevel,
    score,
    summary,
    signals
  };
}

module.exports = analyzeUrl;