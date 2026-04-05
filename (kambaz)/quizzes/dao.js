import model from "./model.js";

function recalculatePoints(quiz) {
  const questions = quiz.questions || [];
  const totalPoints = questions.reduce(
    (sum, question) => sum + (Number(question.points) || 0),
    0
  );
  return { ...quiz, points: totalPoints };
}

export default function QuizzesDao() {
  const findAllQuizzes = () => model.find();

  const findQuizzesForCourse = (courseId) =>
    model.find({ course: courseId });

  const findQuizById = (quizId) =>
    model.findById(quizId);

  const createQuiz = async (quiz) => {
    const quizWithPoints = recalculatePoints(quiz);
    return model.create(quizWithPoints);
  };

  const updateQuiz = async (quizId, quizUpdates) => {
    const existingQuiz = await model.findById(quizId);
    if (!existingQuiz) return null;

    const mergedQuiz = {
      ...existingQuiz.toObject(),
      ...quizUpdates,
    };

    const quizWithPoints = recalculatePoints(mergedQuiz);

    await model.updateOne(
      { _id: quizId },
      { $set: quizWithPoints }
    );

    return model.findById(quizId);
  };

  const deleteQuiz = (quizId) =>
    model.deleteOne({ _id: quizId });

  return {
    findAllQuizzes,
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}