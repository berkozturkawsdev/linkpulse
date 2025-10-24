import axios from "axios";
import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleScan = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/scan`, {
        query: input, // send whatever user entered
      });
      setResult(res.data.result);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center text-gray-800">
      {/* Header */}
      <header className="w-full py-6 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold text-indigo-600">LinkSleuth</h1>
          <nav className="space-x-6">
            <a href="#features" className="hover:text-indigo-600">
              Features
            </a>
            <a href="#pricing" className="hover:text-indigo-600">
              Pricing
            </a>
            <a href="#contact" className="hover:text-indigo-600">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Find Broken Links Before Your Visitors Do
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Paste your website URL and instantly see which links are broken, slow,
          or redirected. Keep your site healthy and your SEO strong.
        </p>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter your website URL"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 w-72 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={() => handleScan()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow"
          >
            Check Now
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          No signup required for your first scan.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="mt-24 max-w-5xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why LinkSleuth?
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold mb-2">🚦 Fast Scanning</h4>
            <p className="text-gray-600">
              Instantly crawl your site and check all links in parallel for
              broken, redirected, or slow responses.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold mb-2">📬 Email Alerts</h4>
            <p className="text-gray-600">
              Get notified when new broken links appear — before your visitors
              notice.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold mb-2">📊 Simple Reports</h4>
            <p className="text-gray-600">
              See detailed reports with link status, response times, and SEO
              impact summaries.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mt-24 bg-white w-full py-20 border-t">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-8">Simple Pricing</h3>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-8 border rounded-2xl shadow-sm">
              <h4 className="text-2xl font-semibold mb-3">Free</h4>
              <p className="text-gray-600 mb-4">Manual scans for one site.</p>
              <p className="text-3xl font-bold mb-6">$0</p>
              <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-xl transition">
                Try Now
              </button>
            </div>
            <div className="p-8 border-2 border-indigo-600 rounded-2xl shadow-md">
              <h4 className="text-2xl font-semibold mb-3">Pro</h4>
              <p className="text-gray-600 mb-4">
                Automatic weekly scans + email alerts.
              </p>
              <p className="text-3xl font-bold mb-6">
                $5<span className="text-lg text-gray-600">/mo</span>
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="w-full py-10 bg-gray-900 text-gray-300 mt-24"
      >
        <div className="max-w-6xl mx-auto text-center">
          <p>© {new Date().getFullYear()} LinkSleuth. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with ❤️ by Berk.</p>
        </div>
      </footer>
    </div>
  );
}
