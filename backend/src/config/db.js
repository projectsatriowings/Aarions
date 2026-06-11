import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    // Set DNS servers to Google and Cloudflare to resolve SRV records on Windows reliably
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (dnsErr) {
      console.warn("Could not set custom DNS servers:", dnsErr.message);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
