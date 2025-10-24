const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

// Configure S3
const REGION = "eu-west-1"; // change if needed
const BUCKET_NAME = "boz-linkpulse-result"; // replace with your bucket
const s3 = new S3Client({ region: REGION });

/**
 * Save a JavaScript object as JSON to S3 and return a pre-signed URL
 * @param {Object} data - The JSON data to save
 * @returns {Promise<{scanId: string, resultUrl: string}>}
 */
async function saveJsonToS3(data) {
  const scanId = uuidv4();
  const s3Key = `results/${scanId}.json`;
  const jsonBody = JSON.stringify(data);

  // Save JSON
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: jsonBody,
      ContentType: "application/json",
    })
  );

  // Generate pre-signed URL (1 hour)
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key }),
    { expiresIn: 3600 }
  );

  return { scanId, resultUrl: url };
}

module.exports = { saveJsonToS3 };
