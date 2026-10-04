function analyzeScamMessage(message) {

  const text = message.toLowerCase().trim();

  let score = 0;
  const signals = [];


  // Helper function
  function findMatches(patterns) {
    return patterns.filter(pattern => text.includes(pattern));
  }


  // ==========================================
  // 1. GUARANTEED / UNREALISTIC RETURNS
  // ==========================================

  const returnPatterns = [
  // English
  "guaranteed return",
  "guaranteed returns",
  "guaranteed profit",
  "risk free",
  "risk-free",
  "100% profit",
  "double your money",
  "fixed return",
  "assured return",

  // Hinglish
  "paisa double",
  "paise double",
  "paisa dugna",
  "paise dugne",
  "guaranteed paisa",
  "fixed profit",
  "pakka profit",
  "sure profit",

  // Hindi
  "पैसा डबल",
  "पैसे डबल",
  "पैसा दुगना",
  "पैसे दुगने",
  "गारंटीड रिटर्न",
  "गारंटीड प्रॉफिट",
  "गारंटी वाला रिटर्न",
  "पक्का मुनाफा",
  "पक्का लाभ",
  "निश्चित मुनाफा",
  "निश्चित लाभ",
  "बिना जोखिम",
  "100 प्रतिशत मुनाफा"
];

  const returnMatches = findMatches(returnPatterns);

  if (returnMatches.length > 0) {

    score += 30;

    signals.push({
      type: "Guaranteed or Unrealistic Returns",
      severity: "high",
      evidence: returnMatches.join(", "),
      explanation:
        "The message contains language suggesting guaranteed or unusually certain financial returns."
    });
  }


  // ==========================================
  // 2. URGENCY / PRESSURE
  // ==========================================

  const urgencyPatterns = [
  // English
  "act now",
  "invest today",
  "limited time",
  "limited slots",
  "hurry",
  "urgent",
  "last chance",
  "offer expires",
  "today only",

  // Hinglish
  "abhi invest",
  "aaj hi invest",
  "jaldi karo",
  "abhi paisa",
  "turant payment",
  "turant invest",
  "der mat karo",
  "mauka haath se",
  "last chance",

  // Hindi
  "अभी निवेश",
  "आज ही निवेश",
  "जल्दी करें",
  "तुरंत निवेश",
  "तुरंत भुगतान",
  "देर मत करें",
  "आखिरी मौका",
  "सीमित समय",
  "ऑफर खत्म",
  "अभी पैसा",
  "आज ही पैसा"
];

  const urgencyMatches = findMatches(urgencyPatterns);

  if (urgencyMatches.length > 0) {

    score += 20;

    signals.push({
      type: "Urgency or Pressure",
      severity: "medium",
      evidence: urgencyMatches.join(", "),
      explanation:
        "The message creates pressure to act quickly, which can discourage careful verification."
    });
  }


  // ==========================================
  // 3. AUTHORITY CLAIM
  // ==========================================

  const authorityPatterns = [
    "sebi approved",
    "sebi registered",
    "government approved",
    "rbi approved",
    "official government scheme",

    // Hindi / Hinglish
    "sebi से approved",
    "सरकार द्वारा approved",
    "सरकारी योजना"
  ];

  const authorityMatches = findMatches(authorityPatterns);

  if (authorityMatches.length > 0) {

    score += 20;

    signals.push({
      type: "Authority Claim",
      severity: "medium",
      evidence: authorityMatches.join(", "),
      explanation:
        "The message makes a regulatory or authority-related claim that should be independently verified."
    });
  }


  // ==========================================
  // 4. EXTERNAL CONTACT
  // ==========================================

  const contactPatterns = [
  // English
  "whatsapp",
  "telegram",
  "contact us",
  "dm us",
  "message us",
  "join our group",

  // Hinglish
  "whatsapp par",
  "whatsapp pe",
  "telegram par",
  "group join karo",
  "mujhe contact karo",

  // Hindi
  "व्हाट्सऐप",
  "व्हाट्सएप",
  "टेलीग्राम",
  "हमसे संपर्क करें",
  "ग्रुप में जुड़ें",
  "ग्रुप से जुड़ें",
  "संपर्क करें"
];

  const contactMatches = findMatches(contactPatterns);

  if (contactMatches.length > 0) {

    score += 10;

    signals.push({
      type: "External Contact",
      severity: "low",
      evidence: contactMatches.join(", "),
      explanation:
        "The message directs the user to communicate through an external messaging channel."
    });
  }


  // ==========================================
  // 5. SENSITIVE INFORMATION
  // ==========================================

  const sensitivePatterns = [
  // English
  "send otp",
  "share otp",
  "otp",
  "pin",
  "password",
  "cvv",
  "bank details",
  "account number",
  "card number",

  // Hinglish
  "otp bhejo",
  "otp bhej",
  "otp share karo",
  "password bhejo",
  "pin bhejo",
  "bank details bhejo",

  // Hindi
  "ओटीपी भेजें",
  "ओटीपी शेयर करें",
  "ओटीपी बताएं",
  "ओटीपी दें",
  "पासवर्ड भेजें",
  "पिन भेजें",
  "बैंक डिटेल",
  "बैंक विवरण",
  "खाता नंबर",
  "कार्ड नंबर",
  "सीवीवी"
];

  const sensitiveMatches = findMatches(sensitivePatterns);

  if (sensitiveMatches.length > 0) {

    score += 30;

    signals.push({
      type: "Sensitive Information Request",
      severity: "high",
      evidence: sensitiveMatches.join(", "),
      explanation:
        "The message appears to request sensitive credentials or financial information. Such information should not be shared."
    });
  }


  // ==========================================
  // 6. PAYMENT PRESSURE
  // ==========================================

  const paymentPatterns = [
  // English
  "send money",
  "transfer money",
  "pay now",
  "deposit now",
  "upi",
  "payment link",
  "make payment",
  "transfer ₹",
  "transfer rs",

  // Hinglish
  "paise bhejo",
  "paisa bhejo",
  "paisa jama karo",
  "payment karo",
  "upi par bhejo",
  "abhi payment karo",
  "money transfer karo",

  // Hindi
  "पैसे भेजें",
  "पैसा भेजें",
  "पैसे जमा करें",
  "पैसा जमा करें",
  "अभी भुगतान",
  "भुगतान करें",
  "यूपीआई पर भेजें",
  "पैसे ट्रांसफर करें"
];

  const paymentMatches = findMatches(paymentPatterns);

  if (paymentMatches.length > 0) {

    score += 25;

    signals.push({
      type: "Payment Pressure",
      severity: "high",
      evidence: paymentMatches.join(", "),
      explanation:
        "The message appears to encourage an immediate payment or financial transfer."
    });
  }


  // ==========================================
  // 7. SECRECY
  // ==========================================

  const secrecyPatterns = [
    "keep this secret",
    "don't tell anyone",
    "do not tell anyone",
    "secret opportunity",
    "confidential offer",

    // Hindi / Hinglish
    "किसी को मत बताना",
    "गुप्त अवसर"
  ];

  const secrecyMatches = findMatches(secrecyPatterns);

  if (secrecyMatches.length > 0) {

    score += 15;

    signals.push({
      type: "Secrecy or Isolation",
      severity: "medium",
      evidence: secrecyMatches.join(", "),
      explanation:
        "The message encourages secrecy, which can prevent users from seeking independent advice or verification."
    });
  }


  // ==========================================
  // LIMIT SCORE
  // ==========================================

  score = Math.min(score, 100);


  // ==========================================
  // RISK LEVEL
  // ==========================================

  let riskLevel;

  if (score >= 60) {
    riskLevel = "high";
  }
  else if (score >= 30) {
    riskLevel = "medium";
  }
  else {
    riskLevel = "low";
  }


  // ==========================================
  // OVERALL EXPLANATION
  // ==========================================

  let summary;

  if (riskLevel === "high") {

    summary =
      "Multiple high-risk indicators were detected. Avoid taking financial action until the information is independently verified.";

  }
  else if (riskLevel === "medium") {

    summary =
      "Some warning signs were detected. Take caution and independently verify the claims before acting.";

  }
  else {

    summary =
      "No major warning patterns were detected by the current rules. This does not prove that the content is legitimate.";

  }


  // ==========================================
  // SAFE ACTIONS
  // ==========================================

  let safeActions;

if (riskLevel === "high") {
  safeActions = [
    "Do not transfer money or make payments based on this message.",
    "Never share OTP, PIN, passwords, CVV or other sensitive credentials.",
    "Stop communicating through the contact details provided in the suspicious message.",
    "Verify the organization or claim independently using appropriate official sources."
  ];
} else if (riskLevel === "medium") {
  safeActions = [
    "Pause before taking any financial action.",
    "Independently verify the organization and claims through appropriate official sources.",
    "Do not share sensitive credentials or authentication information.",
    "Be cautious if the message creates urgency or pressure."
  ];
} else {
  safeActions = [
    "Continue to verify important financial claims independently.",
    "Never share OTP, PIN, passwords or other sensitive credentials.",
    "Be cautious of unexpected financial requests or pressure."
  ];
}


  return {
    riskLevel,
    score,
    summary,
    signals,
    safeActions
  };
}


module.exports = analyzeScamMessage;