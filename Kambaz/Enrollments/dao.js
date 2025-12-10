import model from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId });
    const courseIds = enrollments.map((enrollment) => enrollment.course);
    // Fetch courses directly since populate might not work with string IDs
    const courseModel = (await import("../Courses/model.js")).default;
    const courses = await courseModel.find({ _id: { $in: courseIds } });
    return courses.map(c => c.toObject ? c.toObject() : c);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId });
    const userIds = enrollments.map((enrollment) => enrollment.user);
    // Fetch users directly since populate might not work with string IDs
    const userModel = (await import("../Users/model.js")).default;
    const users = await userModel.find({ _id: { $in: userIds } });
    return users.map(u => u.toObject ? u.toObject() : u);
  }

  async function findEnrollmentsForUser(userId) {
    const enrollments = await model.find({ user: userId });
    return enrollments;
  }

  async function findAllEnrollments() {
    return await model.find();
  }

  async function enrollUserInCourse(userId, courseId) {
    return await model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }

  async function unenrollUserFromCourse(userId, courseId) {
    const result = await model.deleteOne({ user: userId, course: courseId });
    return result.deletedCount > 0;
  }

  async function unenrollAllUsersFromCourse(courseId) {
    return await model.deleteMany({ course: courseId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    findEnrollmentsForUser,
    findAllEnrollments,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse
  };
}
