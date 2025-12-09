import model from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
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
