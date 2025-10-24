const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Validate that input is a non-empty string
 */
function isValidInput(query) {
  return query && typeof query === "string";
}

/**
 * Validate a URL format (http or https)
 */
function isValidUrl(query) {
  try {
    const url = new URL(query);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Fetch a webpage and extract all absolute links
 * @param {string} pageUrl
 * @returns {Promise<string[]>}
 */
async function extractLinks(pageUrl) {
  const response = await axios.get(pageUrl, {
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/141.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
  });
  const $ = cheerio.load(response.data);

  const links = [];
  $("a[href]").each((_, elem) => {
    const href = $(elem).attr("href");
    if (href) {
      try {
        links.push(new URL(href, pageUrl).href);
      } catch {
        // Skip invalid URLs
      }
    }
  });

  return links;
}

/**
 * Check an array of URLs for broken links
 * @param {string[]} urls
 * @param {number} concurrency
 * @returns {Promise<{url: string, status: number, broken: boolean}[]>}
 */
async function checkLinks(urls, concurrency = 10) {
  const results = [];

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (url) => {
        try {
          const res = await axios.head(url, {
            timeout: 10000,
            maxRedirects: 5,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
          });
          return { url, status: res.status, broken: res.status !== 200 };
        } catch (err) {
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

module.exports = { isValidInput, isValidUrl, extractLinks, checkLinks };
