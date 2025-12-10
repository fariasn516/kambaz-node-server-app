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
Lab5(app);
Hello(app)
UserRoutes(app, db);
CourseRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentsRoutes(app, db);
ModulesRoutes(app, db);
app.listen(process.env.PORT || 4000)