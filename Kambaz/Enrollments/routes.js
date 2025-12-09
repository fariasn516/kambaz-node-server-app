import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const enrollUserInCourse = (req, res) => {
    const { courseId } = req.params;
    const userId = req.session["currentUser"]?._id || req.body?.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const enrollment = dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  const unenrollUserFromCourse = (req, res) => {
    const { courseId } = req.params;
    const userId = req.session["currentUser"]?._id || req.body?.userId || req.query?.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const success = dao.unenrollUserFromCourse(userId, courseId);
    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  };

  const findEnrollmentsForCurrentUser = (req, res) => {
    const userId = req.session["currentUser"]?._id || req.query?.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  app.post("/api/enrollments/:courseId", enrollUserInCourse);
  app.delete("/api/enrollments/:courseId", unenrollUserFromCourse);
  app.get("/api/enrollments", findEnrollmentsForCurrentUser);
}

