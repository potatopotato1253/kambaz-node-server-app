import QuizzesDao from "./dao.js";

export default function QuizRoutes(app) {
  const dao = QuizzesDao();

  const findAllQuizzes = async (req, res) => {
    const quizzes = await dao.findAllQuizzes();
    res.json(quizzes);
  };

  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const quizzes = await dao.findQuizzesForCourse(cid);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.findQuizById(qid);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }
    res.json(quiz);
  };

  const createQuiz = async (req, res) => {
    const { cid } = req.params;

    const quizzes = await dao.findAllQuizzes();

    const maxQuizNumber = quizzes.reduce((max, quiz) => {
      const match = String(quiz._id).match(/^Q(\d+)$/);
      if (!match) return max;
      return Math.max(max, Number(match[1]));
    }, 200);

    const nextQuizId = req.body._id || `Q${maxQuizNumber + 1}`;

    const newQuiz = {
      _id: nextQuizId,
      course: cid,
      title: req.body.title || "New Quiz",
      description: req.body.description || "",
      quizType: req.body.quizType || "Graded Quiz",
      assignmentGroup: req.body.assignmentGroup || "Quizzes",
      points: req.body.points || 0,
      shuffleAnswers:
        req.body.shuffleAnswers !== undefined ? req.body.shuffleAnswers : true,
      timeLimit: req.body.timeLimit || 20,
      multipleAttempts: req.body.multipleAttempts || false,
      howManyAttempts: req.body.howManyAttempts || 1,
      showCorrectAnswers: req.body.showCorrectAnswers || "Always",
      accessCode: req.body.accessCode || "",
      oneQuestionAtATime:
        req.body.oneQuestionAtATime !== undefined
          ? req.body.oneQuestionAtATime
          : true,
      webcamRequired: req.body.webcamRequired || false,
      lockQuestionsAfterAnswering:
        req.body.lockQuestionsAfterAnswering || false,
      dueDate: req.body.dueDate || null,
      availableDate: req.body.availableDate || null,
      untilDate: req.body.untilDate || null,
      published: req.body.published || false,
      questions: req.body.questions || [],
    };

    const createdQuiz = await dao.createQuiz(newQuiz);
    res.json(createdQuiz);
  };

  const updateQuiz = async (req, res) => {
    const { qid } = req.params;
    const updatedQuiz = await dao.updateQuiz(qid, req.body);

    if (!updatedQuiz) {
      res.sendStatus(404);
      return;
    }

    res.json(updatedQuiz);
  };

  const deleteQuiz = async (req, res) => {
    const { qid } = req.params;
    const status = await dao.deleteQuiz(qid);
    res.json(status);
  };

  app.get("/api/quizzes", findAllQuizzes);
  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:qid", findQuizById);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  app.put("/api/quizzes/:qid", updateQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
}