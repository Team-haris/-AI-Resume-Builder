// Load environment variables
require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Establish database connection
    console.log("Initializing database connection...");
    const db = await connectDB();
    console.log(`Database initialized using: ${db.type.toUpperCase()}`);

    // 2. Start Express Server
    app.listen(PORT, () => {
      console.log("==================================================");
      console.log(` SERVER RUNNING SUCCESSFULLY`);
      console.log(` Port: ${PORT}`);
      console.log(` Mode: ${process.env.NODE_ENV || "development"}`);
      console.log(` Database: ${process.env.DB_TYPE || "sql (sqlite)"}`);
      console.log(` Local URL: http://localhost:${PORT}`);
      console.log("==================================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
