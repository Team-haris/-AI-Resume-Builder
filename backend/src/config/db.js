const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize = null;
let mongoConnection = null;

async function connectDB() {
  const dbType = process.env.DB_TYPE || "sql";

  if (dbType === "mongodb") {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ai-resume-builder";
    try {
      mongoConnection = await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB successfully via Mongoose.");
      return { type: "mongodb", connection: mongoConnection };
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    }
  } else if (dbType === "sql") {
    try {
      // Default to SQLite for zero-configuration, but can be scaled to Postgres/MySQL.
      const storagePath = path.join(__dirname, "../../database.sqlite");
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: storagePath,
        logging: false
      });

      await sequelize.authenticate();
      console.log(`Connected to SQL database successfully via Sequelize (SQLite at: ${storagePath}).`);
      
      // Import models to ensure they are registered and tables are synced
      const { initSqlModels } = require("../models/sql");
      await initSqlModels(sequelize);
      
      return { type: "sql", connection: sequelize };
    } catch (error) {
      console.error("SQL database connection error:", error.message);
      process.exit(1);
    }
  } else {
    console.error(`Invalid DB_TYPE: "${dbType}". Must be "mongodb" or "sql".`);
    process.exit(1);
  }
}

function getSequelize() {
  return sequelize;
}

module.exports = {
  connectDB,
  getSequelize
};
