const express = require("express");
const serverless = require("serverless-http");
const {
  isValidInput,
  isValidUrl,
  extractLinks,
  checkLinks,
} = require("./utils");
const app = express();
app.use(express.json());

app.post("/scan", async (req, res) => {
  const { query } = req.body;

  if (!isValidInput(query)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'query' parameter." });
  }
  if (!isValidUrl(query)) {
    return res.status(400).json({ error: "Invalid URL format." });
  }

  try {
    const links = await extractLinks(query);
    const results = await checkLinks(links);
    res.json({ results });
  } catch (err) {
    if (err.status === 403) {
      return res.status(500).json({
        error:
          "Site blocked the request (403 Forbidden). Cannot verify this link automatically.",
        code: "FORBIDDEN_LINK",
      });
    }

    res.status(500).json({ error: "Failed to scan the URL." });
  }
});

module.exports.handler = serverless(app);
