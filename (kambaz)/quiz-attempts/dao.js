import model from "./model.js";

export default function QuizAttemptsDao() {
  const createQuizAttempt = (attempt) => model.create(attempt);

  const findAttemptsForUserAndQuiz = (userId, quizId) =>
    model.find({ user: userId, quiz: quizId }).sort({ attemptNumber: 1 });

  const findLastAttemptForUserAndQuiz = (userId, quizId) =>
    model.findOne({ user: userId, quiz: quizId }).sort({ attemptNumber: -1 });

  const countAttemptsForUserAndQuiz = (userId, quizId) =>
    model.countDocuments({ user: userId, quiz: quizId });

  const deleteAttemptsForQuiz = (quizId) =>
    model.deleteMany({ quiz: quizId });

  return {
    createQuizAttempt,
    findAttemptsForUserAndQuiz,
    findLastAttemptForUserAndQuiz,
    countAttemptsForUserAndQuiz,
    deleteAttemptsForQuiz,
  };
}