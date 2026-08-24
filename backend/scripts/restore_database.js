import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EJSON } from "bson";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure DNS works reliably on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  console.warn("DNS server note:", dnsErr.message);
}

async function restoreDatabase(targetMongoUri) {
  const uriToUse = targetMongoUri || process.env.NEW_MONGO_URI || process.env.MONGO_URI;
  if (!uriToUse) {
    console.error("ERROR: No target MongoDB URI provided.");
    process.exit(1);
  }

  const latestDir = path.join(__dirname, "../database_backups", "latest");
  const manifestPath = path.join(latestDir, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    console.error(`ERROR: No backup found at ${manifestPath}. Run backup_database.js first.`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  console.log("--------------------------------------------------");
  console.log(`Loaded Backup Manifest created at: ${manifest.timestamp}`);
  console.log(`Source DB: ${manifest.sourceDatabase} (${manifest.sourceHost})`);
  console.log(`Total Collections to Restore: ${manifest.totalCollections}`);
  console.log(`Total Documents to Restore  : ${manifest.totalDocuments}`);
  console.log("--------------------------------------------------");

  console.log("Connecting to Target MongoDB...");
  const conn = await mongoose.connect(uriToUse);
  console.log(`Connected to Target host: ${conn.connection.host}`);
  console.log(`Target Database name    : ${conn.connection.name}`);
  console.log("--------------------------------------------------");

  const targetDb = mongoose.connection.db;
  const restoreResults = {};
  let totalRestoredDocs = 0;

  for (const [colName, colMeta] of Object.entries(manifest.collections)) {
    const filePath = path.join(latestDir, colMeta.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`WARNING: File missing for ${colName}: ${filePath}`);
      continue;
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");
    const docs = EJSON.parse(rawContent);

    const targetCol = targetDb.collection(colName);

    // Drop existing collection in target DB if present to ensure clean idempotency
    try {
      await targetCol.drop();
    } catch (dropErr) {
      // Ignore namespace not found error
    }

    if (docs.length > 0) {
      const insertResult = await targetCol.insertMany(docs, { ordered: true });
      restoreResults[colName] = insertResult.insertedCount;
      totalRestoredDocs += insertResult.insertedCount;
      console.log(`✓ Restored: [${colName.padEnd(25)}] -> ${insertResult.insertedCount.toString().padStart(5)} / ${docs.length} documents`);
    } else {
      // Create empty collection
      await targetDb.createCollection(colName);
      restoreResults[colName] = 0;
      console.log(`✓ Created : [${colName.padEnd(25)}] ->     0 documents (empty collection)`);
    }
  }

  console.log("--------------------------------------------------");
  console.log(`MIGRATION & RESTORE COMPLETE SUCCESS!`);
  console.log(`Target Host      : ${conn.connection.host}`);
  console.log(`Target Database  : ${conn.connection.name}`);
  console.log(`Restored Total   : ${totalRestoredDocs} documents across ${Object.keys(restoreResults).length} collections`);
  console.log("--------------------------------------------------");

  await mongoose.disconnect();
  console.log("Disconnected cleanly from Target MongoDB.");
}

// Allow running from CLI with argument: node restore_database.js "mongodb+srv://..."
const targetUriArg = process.argv[2];
restoreDatabase(targetUriArg).catch((err) => {
  console.error("CRITICAL RESTORE ERROR:", err);
  process.exit(1);
});
