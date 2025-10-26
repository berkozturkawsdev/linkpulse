const express = require("express");
const serverless = require("serverless-http");
const {
  isValidInput,
  ensureHttps,
  extractLinks,
  checkLinks,
} = require("./utils");
const app = express();
app.use(express.json());

app.post("/scan", async (req, res) => {
  let { query } = req.body;

  if (!isValidInput(query)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'query' parameter." });
  }

  query = ensureHttps(query);
  try {
    let links = await extractLinks(query);

    // Limit links based on env variable
    const maxLinks = parseInt(process.env.MAX_LINKS) || 50; // default 50
    if (links.length > maxLinks) {
      links = links.slice(0, maxLinks);
    }

    const results = await checkLinks(links);
    res.json({ results, scanned: links.length, totalFound: links.length });
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
