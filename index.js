import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./(kambaz)/database/index.js";

import UserRoutes from "./(kambaz)/users/routes.js";
import CourseRoutes from "./(kambaz)/courses/routes.js";
import ModulesRoutes from "./(kambaz)/modules/routes.js";
import AssignmentRoutes from "./(kambaz)/assignments/routes.js";
import EnrollmentRoutes from "./(kambaz)/enrollments/routes.js";
import QuizRoutes from "./(kambaz)/quizzes/routes.js";
import QuizAttemptRoutes from "./(kambaz)/quiz-attempts/routes.js";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

mongoose.connect(CONNECTION_STRING);

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/kambaz-next-js-sp26-git-.*\.vercel\.app$/.test(origin);

      if (allowed) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
  })
);

const isProduction = process.env.SERVER_ENV !== "development";

app.set("trust proxy", 1);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  },
};

if (isProduction) {
  sessionOptions.proxy = true;
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
QuizRoutes(app);
QuizAttemptRoutes(app);

Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);