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

// Configure S3
const s3 = new S3Client({ region: "eu-central-1" }); // change region
const BUCKET_NAME = "boz-linkpulse-result"; // replace with your bucket

app.post("/scan", async (req, res) => {
  const { query } = req.body;
  console.log("Received:", query);

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
    console.error(err);
    res.status(500).json({ error: "Failed to scan the URL." });
  }
});

module.exports.handler = serverless(app);
