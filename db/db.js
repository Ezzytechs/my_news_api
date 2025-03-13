const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.URI, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process if the connection fails
  }
}

module.exports = connectToDatabase;
