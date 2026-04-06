import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../quizzes/dao.js";

export default function QuizAttemptRoutes(app) {
  const dao = QuizAttemptsDao();
  const quizzesDao = QuizzesDao();

  const submitQuizAttempt = async (req, res) => {
    const { qid } = req.params;
    const { user, answers = {} } = req.body;

    if (!user) {
      res.status(400).json({ message: "user is required" });
      return;
    }

    const quiz = await quizzesDao.findQuizById(qid);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }

    const existingCount = await dao.countAttemptsForUserAndQuiz(user, qid);

    const maxAttempts = quiz.multipleAttempts
      ? Number(quiz.howManyAttempts) || 1
      : 1;

    if (existingCount >= maxAttempts) {
      res.status(400).json({
        message: "Maximum attempts reached",
      });
      return;
    }

    let score = 0;

    for (const question of quiz.questions || []) {
      const userAnswer = answers[question._id];

      if (question.type === "Multiple Choice") {
        const correctChoice = (question.choices || []).find((c) => c.correct);
        if (correctChoice && userAnswer === correctChoice.text) {
          score += Number(question.points) || 0;
        }
      }

      if (question.type === "True/False") {
        if (userAnswer === question.answer) {
          score += Number(question.points) || 0;
        }
      }

      if (question.type === "Fill in the Blank") {
        const acceptableAnswers = (question.answers || []).map((a) =>
          String(a).trim().toLowerCase()
        );

        if (
          typeof userAnswer === "string" &&
          acceptableAnswers.includes(userAnswer.trim().toLowerCase())
        ) {
          score += Number(question.points) || 0;
        }
      }
    }

    const attemptNumber = existingCount + 1;

    const attempt = {
      _id: `A${Date.now()}`,
      quiz: qid,
      course: quiz.course,
      user,
      attemptNumber,
      score,
      answers,
      submittedAt: new Date(),
    };

    const createdAttempt = await dao.createQuizAttempt(attempt);
    res.json(createdAttempt);
  };

  const findAttemptsForUserAndQuiz = async (req, res) => {
    const { qid, uid } = req.params;
    const attempts = await dao.findAttemptsForUserAndQuiz(uid, qid);
    res.json(attempts);
  };

  const findLastAttemptForUserAndQuiz = async (req, res) => {
    const { qid, uid } = req.params;
    const attempt = await dao.findLastAttemptForUserAndQuiz(uid, qid);
    if (!attempt) {
      res.json(null);
      return;
    }
    res.json(attempt);
  };

  const countAttemptsForUserAndQuiz = async (req, res) => {
    const { qid, uid } = req.params;
    const count = await dao.countAttemptsForUserAndQuiz(uid, qid);
    res.json({ count });
  };

  app.post("/api/quizzes/:qid/attempts", submitQuizAttempt);
  app.get("/api/quizzes/:qid/attempts/user/:uid", findAttemptsForUserAndQuiz);
  app.get("/api/quizzes/:qid/attempts/user/:uid/last", findLastAttemptForUserAndQuiz);
  app.get("/api/quizzes/:qid/attempts/user/:uid/count", countAttemptsForUserAndQuiz);
}