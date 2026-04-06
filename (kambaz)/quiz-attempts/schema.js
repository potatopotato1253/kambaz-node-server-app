import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    quiz: { type: String, required: true, index: true },
    course: { type: String, required: true, index: true },
    user: { type: String, required: true, index: true },
    attemptNumber: { type: Number, required: true, default: 1 },
    score: { type: Number, default: 0 },
    answers: { type: Object, default: {} },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "attempts" }
);

export default attemptSchema;