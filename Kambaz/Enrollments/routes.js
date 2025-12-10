import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const enrollUserInCourse = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.session["currentUser"]?._id || req.body?.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const enrollment = await dao.enrollUserInCourse(userId, courseId);
    const enrollmentObj = enrollment.toObject ? enrollment.toObject() : enrollment;
    res.json(enrollmentObj);
  };

  const unenrollUserFromCourse = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.session["currentUser"]?._id || req.body?.userId || req.query?.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const success = await dao.unenrollUserFromCourse(userId, courseId);
    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  };

  const findEnrollmentsForCurrentUser = async (req, res) => {
    const userId = req.session["currentUser"]?._id || req.query?.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const enrollments = await dao.findEnrollmentsForUser(userId);
    const enrollmentsArray = Array.isArray(enrollments) 
      ? enrollments.map(e => e.toObject ? e.toObject() : e) 
      : [];
    res.json(enrollmentsArray);
  };

  const findUsersForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await dao.findUsersForCourse(courseId);
      const usersArray = Array.isArray(users) 
        ? users.map(u => u.toObject ? u.toObject() : u) 
        : [];
      res.json(usersArray);
    } catch (error) {
      console.error("Error finding users for course:", error);
      res.status(500).json({ error: error.message });
    }
  };

  app.post("/api/enrollments/:courseId", enrollUserInCourse);
  app.delete("/api/enrollments/:courseId", unenrollUserFromCourse);
  app.get("/api/enrollments", findEnrollmentsForCurrentUser);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
}

