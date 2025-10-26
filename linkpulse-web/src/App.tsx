import { useState } from "react";
import "./App.css";
import LinksTable from "./LinksTable";
import InfoBox from "./InfoBox";
import ErrorDisplay from "./ErrorDisplay";

export default function App() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState([]);

  const handleScan = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    setError("");
    setResult([]);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.code === "FORBIDDEN_LINK") {
          setError(
            "We couldn’t check this link because the site blocked automated requests. You may need to check it manually."
          );
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      } else if (data.errorType === "LambdaTimeoutError") {
        setError(
          "Scanning took too long and timed out. Try checking a smaller page or try again later."
        );
      }

      setResult(data.results);
    } catch (err) {
      setError(
        "Something went wrong while checking the site. Please try again."
      );
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  const showTable = result && result.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <header
        className="w-full py-6 shadow-sm"
        style={{ backgroundColor: "var(--color-dark)" }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">
            <a href="/" style={{ color: "var(--color-white)" }}>
              LinkCheckr
            </a>
          </h1>

          <nav className="space-x-6"></nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Find Broken Links Before Your Visitors Do
        </h2>
        <p
          className="text-lg max-w-2xl mb-8"
          style={{ color: "var(--color-text-light)" }}
        >
          Paste your website URL and instantly see which links are broken, slow,
          or redirected. Keep your site healthy and your SEO strong.{" "}
          <strong>Free tier scans only the first 50 links.</strong>
        </p>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter your website URL"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="search-input border rounded-lg px-4 py-3 w-100 focus:ring-2 outline-none"
          />
          <button
            onClick={handleScan}
            disabled={isDisabled}
            className={`btn flex items-center justify-center space-x-2 font-semibold px-6 py-3 rounded shadow-md transition-all duration-200 ${
              isDisabled
                ? "cursor-not-allowed"
                : "hover:brightness-110 text-white"
            }`}
          >
            {isLoading && (
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            <span>{isLoading ? "Scanning..." : "Check Now"}</span>
          </button>
        </div>

        {/* Error feedback */}
        {error && <ErrorDisplay error={error}></ErrorDisplay>}

        {/* Result table */}
        {showTable && <LinksTable results={result} />}
      </section>

      {/* Features */}
      <section id="features" className="mt-24 max-w-5xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why LinkCheckr?
        </h3>
        <div className="grid md:grid-cols-2 gap-10">
          <InfoBox
            title="🚦 Fast Scanning"
            text="See detailed reports with link status, response times, and SEO
              impact summaries."
          ></InfoBox>
          <InfoBox
            title="📊 Simple Reports"
            text="Instantly crawl your site and check all links in parallel for
              broken, redirected, or slow responses."
          ></InfoBox>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full py-10 mt-24"
        style={{
          backgroundColor: "var(--color-dark)",
          color: "var(--color-white)",
        }}
      >
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} LinkCheckr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
