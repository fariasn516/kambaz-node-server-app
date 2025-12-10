import cors from "cors";
import express from 'express'
import Hello from "./Hello.js";
import db from "./Kambaz/Database/index.js"
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import Lab5 from "./Lab5/index.js"
import "dotenv/config";
import session from "express-session";
import mongoose from "mongoose";
import userModel from "./Kambaz/Users/model.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"

// Log which connection is being used (mask password for security)
const maskedConnection = CONNECTION_STRING.includes('@') 
  ? CONNECTION_STRING.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@')
  : CONNECTION_STRING;
console.log(`🔌 Connecting to MongoDB: ${maskedConnection}`);
console.log(`📍 Connection type: ${CONNECTION_STRING.includes('mongodb+srv') ? 'Atlas (Cloud)' : CONNECTION_STRING.includes('127.0.0.1') ? 'Local' : 'Custom'}`);

mongoose.connect(CONNECTION_STRING);

const checkDatabase = async () => {
  try {
    const userCount = await userModel.countDocuments();
    console.log(`📊 Database: ${userCount} users found`);
  } catch (error) {
    console.error("Error checking database:", error);
  }
};

mongoose.connection.on('connected', async () => {
  console.log('✅ MongoDB connected successfully');
  await checkDatabase();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

const app = express();
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie.sameSite = "none";
  sessionOptions.cookie.secure = true;
} else {
  sessionOptions.cookie.sameSite = "lax";
  sessionOptions.cookie.secure = false;
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());
app.use(session(sessionOptions));

// Diagnostic endpoint to check database contents
app.get("/api/diagnostic/db-check", async (req, res) => {
  try {
    const userCount = await userModel.countDocuments();
    const users = await userModel.find().limit(10).select('_id username firstName lastName role email');
    const usersArray = users.map(u => u.toObject ? u.toObject() : u);
    
    res.json({
      connected: mongoose.connection.readyState === 1,
      connectionString: maskedConnection,
      database: mongoose.connection.db.databaseName,
      collection: "users",
      userCount: userCount,
      sampleUsers: usersArray
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      connected: mongoose.connection.readyState === 1
    });
  }
});

Lab5(app);
Hello(app)
UserRoutes(app, db);
CourseRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentsRoutes(app, db);
ModulesRoutes(app, db);
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
  console.log(`📋 Registered routes: Users, Courses, Assignments, Enrollments, Modules`);
});