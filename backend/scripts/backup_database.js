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

async function runBackup() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("ERROR: MONGO_URI not found in environment variables.");
    process.exit(1);
  }

  console.log("--------------------------------------------------");
  console.log("Connecting to Source MongoDB...");
  const conn = await mongoose.connect(mongoUri);
  console.log(`Connected to host: ${conn.connection.host}`);
  console.log(`Database name: ${conn.connection.name}`);
  console.log("--------------------------------------------------");

  const db = mongoose.connection.db;
  const collectionsList = await db.listCollections().toArray();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, "../database_backups", `backup_${timestamp}`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const manifest = {
    sourceHost: conn.connection.host,
    sourceDatabase: conn.connection.name,
    timestamp: new Date().toISOString(),
    totalCollections: collectionsList.length,
    collections: {},
    totalDocuments: 0,
  };

  const fullDump = {};

  console.log(`Found ${collectionsList.length} collections. Exporting with full BSON type preservation...`);
  console.log("--------------------------------------------------");

  for (const colInfo of collectionsList) {
    const colName = colInfo.name;
    // Skip internal system collections if any
    if (colName.startsWith("system.")) continue;

    const col = db.collection(colName);
    const docs = await col.find({}).toArray();

    // Use EJSON to preserve types like ObjectId, ISODate, NumberInt, etc.
    const serialized = EJSON.stringify(docs, null, 2);
    fullDump[colName] = docs;

    const filePath = path.join(backupDir, `${colName}.json`);
    fs.writeFileSync(filePath, serialized, "utf-8");

    const stats = fs.statSync(filePath);
    manifest.collections[colName] = {
      count: docs.length,
      sizeBytes: stats.size,
      file: `${colName}.json`,
    };
    manifest.totalDocuments += docs.length;

    console.log(`✓ Collection: [${colName.padEnd(25)}] -> ${docs.length.toString().padStart(5)} documents (${(stats.size / 1024).toFixed(2)} KB)`);
  }

  // Write full consolidated backup file
  const fullBackupPath = path.join(backupDir, "full_database_dump.json");
  fs.writeFileSync(fullBackupPath, EJSON.stringify(fullDump, null, 2), "utf-8");

  // Write latest backup pointer
  const latestDir = path.join(__dirname, "../database_backups", "latest");
  if (!fs.existsSync(latestDir)) {
    fs.mkdirSync(latestDir, { recursive: true });
  }
  for (const colName of Object.keys(fullDump)) {
    const serialized = EJSON.stringify(fullDump[colName], null, 2);
    fs.writeFileSync(path.join(latestDir, `${colName}.json`), serialized, "utf-8");
  }
  fs.writeFileSync(path.join(latestDir, "full_database_dump.json"), EJSON.stringify(fullDump, null, 2), "utf-8");

  // Save manifest
  fs.writeFileSync(path.join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");
  fs.writeFileSync(path.join(latestDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");

  console.log("--------------------------------------------------");
  console.log(`BACKUP COMPLETE SUCCESS!`);
  console.log(`Total Collections: ${Object.keys(manifest.collections).length}`);
  console.log(`Total Documents  : ${manifest.totalDocuments}`);
  console.log(`Saved Directory  : ${backupDir}`);
  console.log(`Latest Pointer   : ${latestDir}`);
  console.log("--------------------------------------------------");

  await mongoose.disconnect();
  console.log("Disconnected cleanly from Source MongoDB.");
  process.exit(0);
}

runBackup().catch((err) => {
  console.error("CRITICAL BACKUP ERROR:", err);
  process.exit(1);
});
