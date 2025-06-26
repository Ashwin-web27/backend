import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./models/userModel.js";
import AuditFileModel from "./models/AuditFileModel.js";
import userData from "./data/userData.js";
import auditFileData from "./data/auditData.js";

// Load environment variables from .env
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://surekhanimase26:Pkbk7X0Q1geNVma7@cluster0.dswpk4a.mongodb.net/auditDB?retryWrites=true&w=majority&appName=Cluster0",{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Import Data
const importData = async () => {
  try {
    await connectDB();

    await AuditFileModel.deleteMany();
    await UserModel.deleteMany();

    const createdUsers = await UserModel.insertMany(userData);

    const sampleAuditFiles = auditFileData.map((file) => ({
      ...file,
      user: createdUsers[0]._id,
    }));

    await AuditFileModel.insertMany(sampleAuditFiles);

    console.log("✅ Sample data imported successfully");
    process.exit();
  } catch (error) {
    console.error(`❌ Error during data import: ${error.message}`);
    process.exit(1);
  }
};

// Destroy Data
const destroyData = async () => {
  try {
    await connectDB();

    await AuditFileModel.deleteMany();
    await UserModel.deleteMany();

    console.log("🗑️ All data destroyed successfully");
    process.exit();
  } catch (error) {
    console.error(`❌ Error during data destroy: ${error.message}`);
    process.exit(1);
  }
};

// Command-line switch
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
