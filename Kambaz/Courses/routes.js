import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  }

  const findCoursesForEnrolledUser = async (req, res) => {
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
      const courses = await dao.findAllCourses();
      res.json(courses);
      return;
    }
   const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    const userId = req.session["currentUser"]?._id || req.body.userId;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const newCourse = await dao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(userId, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  }
  
  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  }
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses", findAllCourses);
}
