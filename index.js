import cors from "cors";
import express from 'express'
import Hello from "./Hello.js";
import db from "./Kambaz/Database/index.js"
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import Lab5 from "../app/Labs/Lab5/index.js"
import "dotenv/config";
import session from "express-session";
const app = express();
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));
app.use(express.json());
app.use(
 cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);
Lab5(app);
Hello(app)
UserRoutes(app, db);
CourseRoutes(app, db);
AssignmentRoutes(app, db);
app.listen(process.env.PORT || 4000)