const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");
const runtimeConfigPath = path.join(rootDir, "firebase-runtime-config.js");
const deleteEnvAfterImport = process.argv.includes("--delete-env");

function parseDotEnv(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      accumulator[key] = value;
      return accumulator;
    }, {});
}

if (!fs.existsSync(envPath)) {
  throw new Error(".env file not found. Create .env and run again.");
}

const envValues = parseDotEnv(fs.readFileSync(envPath, "utf8"));

const requiredKeys = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];

const missingKeys = requiredKeys.filter((key) => !envValues[key]);
if (missingKeys.length > 0) {
  throw new Error(`Missing required keys in .env: ${missingKeys.join(", ")}`);
}

const runtimeConfig = {
  apiKey: envValues.FIREBASE_API_KEY,
  authDomain: envValues.FIREBASE_AUTH_DOMAIN,
  projectId: envValues.FIREBASE_PROJECT_ID,
  storageBucket: envValues.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envValues.FIREBASE_MESSAGING_SENDER_ID,
  appId: envValues.FIREBASE_APP_ID,
};

if (envValues.FIREBASE_MEASUREMENT_ID) {
  runtimeConfig.measurementId = envValues.FIREBASE_MEASUREMENT_ID;
}

const output = `window.BUYIT_FIREBASE_CONFIG = ${JSON.stringify(runtimeConfig, null, 2)};\n`;
fs.writeFileSync(runtimeConfigPath, output, "utf8");

if (deleteEnvAfterImport && fs.existsSync(envPath)) {
  fs.unlinkSync(envPath);
  console.log("Imported values and deleted .env file.");
} else {
  console.log("Imported values into firebase-runtime-config.js.");
}
