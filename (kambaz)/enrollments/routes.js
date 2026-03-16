import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const enrollUserInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const { courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(enrollment);
  };

  const unenrollUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const { courseId } = req.params;
    dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.sendStatus(200);
  };

  app.post("/api/courses/:courseId/enrollment", enrollUserInCourse);
  app.delete("/api/courses/:courseId/enrollment", unenrollUserFromCourse);
}