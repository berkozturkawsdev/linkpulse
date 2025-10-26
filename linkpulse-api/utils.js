const axios = require("axios");
const cheerio = require("cheerio");

// Default headers for requests
const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
};
const REQUEST_TIMEOUT = 10000;

/**
 * Validate that input is a non-empty string
 * @param {string} query
 * @returns {boolean}
 */
function isValidInput(query) {
  return typeof query === "string" && query.trim().length > 0;
}

function ensureHttps(query) {
  if (!/^https?:\/\//i.test(query)) {
    return `https://${query}`;
  }
  return query;
}

/**
 * Fetch a webpage and extract all absolute links
 * Skips `javascript:` links
 * @param {string} pageUrl
 * @returns {Promise<string[]>}
 */
async function extractLinks(pageUrl) {
  const response = await axios.get(pageUrl, {
    timeout: REQUEST_TIMEOUT,
    headers: DEFAULT_HEADERS,
  });

  const $ = cheerio.load(response.data);
  const links = [];

  $("a[href]").each((_, elem) => {
    const href = $(elem).attr("href")?.trim();
    if (!href || href.toLowerCase().startsWith("javascript:")) return;

    try {
      links.push(new URL(href, pageUrl).href);
    } catch {
      // Skip invalid URLs
    }
  });
  return links;
}

/**
 * Check an array of URLs for broken links
 * @param {string[]} urls
 * @param {number} concurrency
 * @returns {Promise<{url: string, status: number, broken: boolean, message?: string}[]>}
 */
async function checkLinks(urls, concurrency = 10) {
  const results = [];

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async (url) => {
        try {
          const res = await axios.head(url, {
            timeout: REQUEST_TIMEOUT,
            maxRedirects: 5,
            headers: DEFAULT_HEADERS,
            validateStatus: null, // allow non-200 statuses
          });

          return {
            url,
            status: res.status,
            broken: res.status !== 200,
          };
        } catch (err) {
          // Detect 403 specifically
          if (err.response?.status === 403) {
            return {
              url,
              status: 403,
              broken: true,
              message: "Access Forbidden (403)",
            };
          }

          return {
            url,
            status: err.response?.status || 0,
            broken: true,
            message: err.message,
          };
        }
      })
    );

    results.push(...batchResults);
  }

  return results;
}

module.exports = { isValidInput, ensureHttps, extractLinks, checkLinks };
