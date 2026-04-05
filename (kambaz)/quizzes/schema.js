import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    correct: { type: Boolean, default: false },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    type: {
      type: String,
      enum: ["Multiple Choice", "True/False", "Fill in the Blank"],
      required: true,
    },
    title: { type: String, required: true },
    points: { type: Number, default: 0 },
    question: { type: String, default: "" },

    // for Multiple Choice
    choices: { type: [choiceSchema], default: [] },

    // for True/False
    answer: { type: Boolean },

    // for Fill in the Blank
    answers: { type: [String], default: [] },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    course: { type: String, required: true, index: true },

    title: { type: String, required: true, default: "Unnamed Quiz" },
    description: { type: String, default: "" },

    quizType: {
      type: String,
      enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
      default: "Graded Quiz",
    },

    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },

    points: { type: Number, default: 0 },

    shuffleAnswers: { type: Boolean, default: true },

    timeLimit: { type: Number, default: 20 },

    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },

    showCorrectAnswers: { type: String, default: "Always" },

    accessCode: { type: String, default: "" },

    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },

    dueDate: { type: Date },
    availableDate: { type: Date },
    untilDate: { type: Date },

    published: { type: Boolean, default: false },

    questions: { type: [questionSchema], default: [] },
  },
  { collection: "quizzes" }
);

export default quizSchema;