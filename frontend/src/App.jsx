import { useState } from "react";
import axios from "axios";
import { createWorker } from "tesseract.js";

function App() {

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState(null);
  const [activeTool, setActiveTool] = useState("message");
  const [resultSource, setResultSource] = useState(null);


  const analyzeMessage = async () => {

    if (!message.trim()) {
      setError("Please enter a message first.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/analyze",
        {
          message: message
        }
      );

      setResult(response.data);
      setResultSource("message");

    } catch (err) {

      console.error(err);

      setError(
        "Unable to connect to ScamShield server."
      );

    } finally {

      setLoading(false);

    }
  };
  const analyzeUrlInput = async () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUrlResult(null);

      const response = await axios.post(
        "http://localhost:5000/api/analyze-url",
        {
          url
        }
      );

      setUrlResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze the URL.");
    } finally {
      setLoading(false);
    }
  };
  const analyzeImage = async () => {

    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setError("");
    setResult(null);
    setOcrText("");
    setLoading(true);

    try {

      const worker = await createWorker("eng");

      const {
        data: { text }
      } = await worker.recognize(image);

      await worker.terminate();

      if (!text.trim()) {
        setError("No readable text was found in the image.");
        setLoading(false);
        return;
      }

      setOcrText(text);

      const response = await axios.post(
        "http://localhost:5000/api/analyze",
        {
          message: text
        }
      );

      setResult(response.data);
      setResultSource("screenshot");

    } catch (err) {

      console.error(err);

      setError(
        "Unable to read or analyze the screenshot."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}

      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-lg shadow-indigo-500/20">
              <svg
  viewBox="0 0 24 24"
  className="h-6 w-6 text-white"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M12 3L19 6V11C19 15.5 16.2 19.2 12 21C7.8 19.2 5 15.5 5 11V6L12 3Z" />
  <path d="M8.5 12L10.8 14.3L15.5 9.6" />
</svg>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                ScamShield
              </h1>

              <p className="text-xs text-slate-500">
                Investor Safety Assistant
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              ● AI Protected
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-400">
              Privacy First
            </span>
          </div>

        </div>
      </header>


      {/* Main */}

      <main className="mx-auto max-w-6xl px-6 py-16">


        {/* Hero */}

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_45%)]" />

          <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-16 text-center">

            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300">
              🛡️ AI-powered digital fraud resilience
            </div>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stop.
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Think.
              </span>
              {" "}Verify.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              ScamShield helps you identify suspicious investment messages,
              screenshots, and links — and explains the warning signs in
              simple language.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-400">
                📝 Message Analysis
              </span>

              <span className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-400">
                📷 OCR
              </span>

              <span className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-400">
                🔗 URL Safety
              </span>

              <span className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-400">
                🤖 AI Analysis
              </span>
            </div>

          </div>

        </section>
        <div className="mx-auto mb-8 max-w-7xl px-6 text-center">
          <p className="text-sm font-semibold tracking-wide text-indigo-400">
            ANALYZE SAFELY
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Check suspicious content
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Choose a message, screenshot, or URL to begin.
          </p>
        </div>


        {/* Analyzer */}

        <section className="mx-auto mt-12 max-w-3xl">

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
            <button
              onClick={() => setActiveTool("message")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTool === "message"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              📝 Message
            </button>

            <button
              onClick={() => setActiveTool("screenshot")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTool === "screenshot"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              📷 Screenshot
            </button>

            <button
              onClick={() => setActiveTool("url")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTool === "url"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              🔗 URL
            </button>
          </div>






          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            {activeTool === "message" && (
              <div>
                <div className="mb-5">

                  <h3 className="text-lg font-semibold">
                    Analyze a message
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Paste an investment-related message below.
                  </p>

                </div>


                <textarea

                  value={message}

                  onChange={(e) => setMessage(e.target.value)}

                  className="h-48 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500"

                  placeholder="Example: Guaranteed 30% returns in 30 days. Invest today..."

                />
                {/* Button */}

            <button

              onClick={analyzeMessage}

              disabled={loading}

              className="mt-4 w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"

            >

              {loading
                ? "Analyzing..."
                : "Analyze Message"
              }

            </button>
                
              </div>

            )}
            {activeTool === "screenshot" && (
              <div>
                <div className="mt-4">

                  <p className="mb-7 text-sm font-semibold text-slate-200">
  Upload a screenshot
</p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      setResult(null);
                      setOcrText("");
                      setError("");
                    }}
                    className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-400"
                  />
                  {image && (

                    <button
                      onClick={analyzeImage}
                      disabled={loading}
                      className="mt-4 w-full rounded-xl border border-emerald-500 px-6 py-3 font-semibold text-emerald-400 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {loading
                        ? "Reading screenshot..."
                        : "Analyze Screenshot"
                      }

                    </button>

                  )}

                </div>
              </div>
            )}



            {activeTool === "url" && (
              <div>
                {/* URL Analysis */}
                <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      🔗 Analyze a Suspicious Link
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Paste a financial or investment-related URL to check for
                      suspicious characteristics. ScamShield analyzes the URL
                      without opening the website.
                    </p>
                  </div>

                  <div className="mt-5">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/investment-offer"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                    />

                    <button
                      onClick={analyzeUrlInput}
                      disabled={loading}
                      className="mt-3 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Analyzing..." : "Analyze URL"}
                    </button>
                  </div>
                </div>
              </div>
            )}



            {urlResult && activeTool === "url" && (
              <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    URL Risk Analysis
                  </h3>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${urlResult.riskLevel === "high"
                      ? "bg-red-500/10 text-red-400"
                      : urlResult.riskLevel === "medium"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-emerald-500/10 text-emerald-400"
                      }`}
                  >
                    {urlResult.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      URL risk score
                    </span>

                    <span className="font-bold text-white">
                      {urlResult.score}/100
                    </span>
                  </div>

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                      style={{ width: `${urlResult.score}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <p className="text-sm leading-6 text-slate-300">
                    {urlResult.summary}
                  </p>
                </div>

                {urlResult.signals?.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {urlResult.signals.map((signal, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-white">
                              ⚠️ {signal.type}
                            </h4>

                            <p className="mt-2 text-sm text-emerald-400">
                              <span className="font-semibold">
                                Evidence:
                              </span>{" "}
                              {signal.evidence}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase ${signal.severity === "high"
                              ? "bg-red-500/10 text-red-400"
                              : signal.severity === "medium"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-slate-800 text-slate-400"
                              }`}
                          >
                            {signal.severity}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {signal.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <p className="text-xs leading-5 text-yellow-300">
                    <strong>Safety Note:</strong> URL characteristics are
                    indicators, not proof that a website is fraudulent.
                    ScamShield does not open or verify the destination website.
                  </p>
                </div>
              </div>
            )}


            {/* Error */}

            {error && (

              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>

            )}


            


          </div>

          {activeTool === "screenshot" && ocrText && (

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">

              <h4 className="font-semibold">
                📄 Extracted Text
              </h4>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                {ocrText}
              </p>

            </div>

          )}
          {/* RESULT */}

          {result && resultSource === activeTool && (

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">


              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold">
                  Analysis Result
                </h3>


                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${result.riskLevel === "high"
                    ? "bg-red-500/10 text-red-400"
                    : result.riskLevel === "medium"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-emerald-500/10 text-emerald-400"
                    }`}
                >
                  {result.riskLevel.toUpperCase()}
                </span>

              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                {result.summary}
              </p>

              <div className="mt-6">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-400">
                    Risk indicator score
                  </span>

                  <span className="font-bold text-white">
                    {result.score}/100
                  </span>

                </div>

                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{
                      width: `${result.score}%`
                    }}
                  />

                </div>

              </div>


              {/* Signals */}

              <div className="mt-6">

                <h4 className="font-semibold">
                  Detected Warning Signs
                </h4>


                <div className="mt-4 space-y-4">

                  {result.signals.map((signal, index) => (

                    <div
                      key={index}
                      className="rounded-xl border border-slate-700 bg-slate-950 p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h5 className="font-semibold text-white">
                            ⚠️ {signal.type}
                          </h5>

                          {signal.evidence && (
                            <p className="mt-3 rounded-lg bg-slate-900 p-3 text-sm text-emerald-400">
                              <span className="font-semibold">
                                Evidence:
                              </span>{" "}
                              "{signal.evidence}"
                            </p>
                          )}

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase ${signal.severity === "high"
                            ? "bg-red-500/10 text-red-400"
                            : signal.severity === "medium"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-slate-800 text-slate-400"
                            }`}
                        >
                          {signal.severity}
                        </span>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {signal.explanation}
                      </p>

                    </div>

                  ))}
                  {/* AI Analysis */}
                  {result.aiAnalysis && (
                    <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                          🤖
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-white">
                            AI-Powered Analysis
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-slate-400">
                              Additional risk analysis using Gemini AI
                            </p>

                            {result.aiAnalysis.language && (
                              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                                {result.aiAnalysis.language}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI Summary */}
                      {result.aiAnalysis.summary && (
                        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
                          <p className="text-sm font-semibold text-indigo-400">
                            AI Summary
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {result.aiAnalysis.summary}
                          </p>
                        </div>
                      )}

                      {/* AI Risk Indicators */}
                      {result.aiAnalysis.riskIndicators?.length > 0 && (
                        <div className="mt-5">
                          <h5 className="font-semibold text-white">
                            AI-Detected Warning Signs
                          </h5>

                          <div className="mt-3 space-y-3">
                            {result.aiAnalysis.riskIndicators.map((indicator, index) => (
                              <div
                                key={index}
                                className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                              >
                                <p className="font-semibold text-red-400">
                                  ⚠️ {indicator.type}
                                </p>

                                {indicator.evidence && (
                                  <p className="mt-2 text-sm text-emerald-400">
                                    <span className="font-semibold">Evidence:</span>{" "}
                                    "{indicator.evidence}"
                                  </p>
                                )}

                                {indicator.reason && (
                                  <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {indicator.reason}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Disclaimer */}
                      <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                        <p className="text-xs leading-5 text-yellow-300">
                          <strong>AI Safety Note:</strong> AI analysis identifies
                          potential warning indicators. It does not prove that a
                          message is fraudulent. Always independently verify important
                          financial claims through appropriate official sources.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
              <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">

                <p className="text-sm leading-6 text-yellow-300">

                  <strong>Important:</strong>{" "}
                  These are risk indicators, not proof that the
                  content is fraudulent. Verify important claims
                  through appropriate official sources before taking action.

                </p>

              </div>


              {/* Safe Actions */}

              {/* Safe Next Steps */}
{result.safeActions?.length > 0 && (
  <div
    className={`mt-6 rounded-2xl border p-6 ${
      result.riskLevel === "high"
        ? "border-red-500/20 bg-red-500/5"
        : result.riskLevel === "medium"
        ? "border-yellow-500/20 bg-yellow-500/5"
        : "border-slate-700 bg-slate-900/50"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
          result.riskLevel === "high"
            ? "bg-red-500/10"
            : result.riskLevel === "medium"
            ? "bg-yellow-500/10"
            : "bg-slate-800"
        }`}
      >
        {result.riskLevel === "high"
          ? "🚨"
          : result.riskLevel === "medium"
          ? "⚠️"
          : "🛡️"}
      </div>

      <div>
        <h4 className="text-lg font-bold text-white">
          {result.riskLevel === "high"
            ? "Immediate Safety Actions"
            : result.riskLevel === "medium"
            ? "Recommended Precautions"
            : "General Safety Reminder"}
        </h4>

        <p className="text-sm text-slate-400">
          {result.riskLevel === "high"
            ? "Multiple warning indicators were detected."
            : result.riskLevel === "medium"
            ? "Some warning signs deserve additional caution."
            : "No major warning patterns were detected."}
        </p>
      </div>
    </div>

    <div className="mt-5 space-y-3">
      {result.safeActions.map((action, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950 p-4"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-300">
            {index + 1}
          </div>

          <p className="text-sm leading-6 text-slate-300">
            {action}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
              {/* Verify Safely */}
              <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                    🔎
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      Verify Safely
                    </h4>

                    <p className="text-sm text-slate-400">
                      Before taking action, verify the claim independently.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                    <p className="font-semibold text-white">
                      1. Verify the organization
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Check the organization's identity using an appropriate
                      official source rather than relying on the message or
                      contact details provided in it.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                    <p className="font-semibold text-white">
                      2. Verify the claim independently
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Search for the information independently. Do not rely
                      only on links, phone numbers, or websites provided in
                      a suspicious message.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                    <p className="font-semibold text-white">
                      3. Never share sensitive credentials
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Never share OTPs, PINs, passwords, CVV, or other
                      authentication credentials in response to unsolicited
                      messages.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                    <p className="font-semibold text-white">
                      4. Don't let urgency decide for you
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Claims involving limited-time offers, guaranteed
                      returns, or pressure to act immediately deserve
                      additional verification.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <p className="text-xs leading-5 text-yellow-300">
                    <strong>Remember:</strong> ScamShield provides safety
                    indicators and educational guidance. It does not determine
                    whether an investment is suitable or provide investment
                    recommendations.
                  </p>
                </div>
              </div>
              {/* Report / Escalate Safely */}
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-xl">
                    🚨
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      Report or Get Help
                    </h4>

                    <p className="text-sm text-slate-400">
                      Choose the appropriate official channel based on what happened.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  {/* Chakshu */}
                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                    <div className="text-2xl">📱</div>

                    <h5 className="mt-3 font-semibold text-white">
                      Suspected Fraud Message
                    </h5>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      If you received a suspicious communication, consider
                      reporting it through the official Chakshu platform.
                    </p>

                    <a
                      href="https://sancharsaathi.gov.in/sfc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Open Chakshu →
                    </a>
                  </div>

                  {/* Cyber Crime */}
                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                    <div className="text-2xl">🚔</div>

                    <h5 className="mt-3 font-semibold text-white">
                      Money Already Lost?
                    </h5>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      If you have already lost money to a cyber fraud,
                      report it immediately through the official cyber
                      crime channels.
                    </p>

                    <a
                      href="https://www.cybercrime.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Report Cyber Crime →
                    </a>

                    <p className="mt-3 text-xs font-semibold text-yellow-400">
                      Cyber Crime Helpline: 1930
                    </p>
                  </div>

                  {/* SEBI */}
                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                    <div className="text-2xl">🏛️</div>

                    <h5 className="mt-3 font-semibold text-white">
                      Securities-Market Grievance
                    </h5>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      For applicable grievances involving SEBI-regulated
                      entities, use the official SCORES complaint system.
                    </p>

                    <a
                      href="https://scores.sebi.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Open SEBI SCORES →
                    </a>
                  </div>

                </div>

                <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <p className="text-xs leading-5 text-yellow-300">
                    <strong>Safety reminder:</strong> Use only official
                    reporting channels. ScamShield does not collect OTPs,
                    passwords, PINs, CVVs, or banking credentials.
                  </p>
                </div>
              </div>


            </div>

          )}
          {/* Privacy & Trust */}
          <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                🔒
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  Privacy & Trust
                </h4>

                <p className="text-sm text-slate-400">
                  Designed with investor safety and privacy in mind.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <div className="text-xl">🔐</div>

                <h5 className="mt-3 font-semibold text-white">
                  No Credentials
                </h5>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  ScamShield never asks users to provide OTPs, PINs,
                  passwords, CVVs, or banking credentials.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <div className="text-xl">🔗</div>

                <h5 className="mt-3 font-semibold text-white">
                  Safe URL Analysis
                </h5>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  URLs are analyzed as text. ScamShield does not
                  automatically open suspicious websites.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <div className="text-xl">🤖</div>

                <h5 className="mt-3 font-semibold text-white">
                  AI With Guardrails
                </h5>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  AI identifies warning indicators and does not
                  provide buy, sell, hold, or return predictions.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <div className="text-xl">⚠️</div>

                <h5 className="mt-3 font-semibold text-white">
                  Not Proof of Fraud
                </h5>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Risk scores are indicators. Important claims should
                  always be independently verified.
                </p>
              </div>

            </div>

            <div className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-xs leading-5 text-purple-300">
                <strong>Privacy principle:</strong> Only provide information
                necessary for analysis. Never enter sensitive authentication
                or banking credentials into ScamShield.
              </p>
            </div>
          </div>


        </section>
        {/* How ScamShield Works */}
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wider text-indigo-400">
              HOW IT WORKS
            </p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">
              From suspicious content to safer action
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              ScamShield combines deterministic safety checks, OCR, URL
              analysis, and AI-powered language understanding to help users
              recognize warning signs before taking action.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* Step 1 */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                📥
              </div>

              <div className="mt-5 text-xs font-semibold text-indigo-400">
                STEP 01
              </div>

              <h4 className="mt-2 text-lg font-bold text-white">
                Input
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Paste a suspicious message, upload a screenshot, or
                provide a URL for analysis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                🔍
              </div>

              <div className="mt-5 text-xs font-semibold text-purple-400">
                STEP 02
              </div>

              <h4 className="mt-2 text-lg font-bold text-white">
                Detect
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Rule-based checks identify patterns such as urgency,
                guaranteed returns, payment pressure, and credential
                requests.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-pink-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-xl">
                🤖
              </div>

              <div className="mt-5 text-xs font-semibold text-pink-400">
                STEP 03
              </div>

              <h4 className="mt-2 text-lg font-bold text-white">
                Understand
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Gemini AI provides additional contextual analysis in
                English, Hindi, and Hinglish.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                🛡️
              </div>

              <div className="mt-5 text-xs font-semibold text-emerald-400">
                STEP 04
              </div>

              <h4 className="mt-2 text-lg font-bold text-white">
                Protect
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Users receive explanations, safer next steps,
                verification guidance, and official reporting options.
              </p>
            </div>

          </div>
        </section>



        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-slate-500">

          ScamShield provides educational risk indicators
          and does not provide investment advice or guarantee
          that content is fraudulent.

        </p>


      </main>

    </div>

  );
}

export default App;