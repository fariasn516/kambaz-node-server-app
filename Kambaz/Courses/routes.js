import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  }

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    let user = null;
    if (userId === "current") {
      user = req.session["currentUser"];
      if (!user && req.query?.userId) {
        const { users } = db;
        user = users.find((u) => u._id === req.query.userId);
        userId = req.query.userId;
      } else if (user) {
        userId = user._id;
      } else {
        res.sendStatus(401);
        return;
      }
    } else {
      const { users } = db;
      user = users.find((u) => u._id === userId);
    }
    if (user && (user.role === "ADMIN" || user.role === "FACULTY")) {
      const courses = dao.findAllCourses();
      res.json(courses);
      return;
    }
    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const enrollmentsDao = EnrollmentsDao(db);
  const createCourse = (req, res) => {
    const userId = req.session["currentUser"]?._id || req.body.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(userId, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    res.send(status);
  }
  
  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  }
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses", findAllCourses);
}
