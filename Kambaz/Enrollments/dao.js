import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    // Check if already enrolled
    const alreadyEnrolled = enrollments.some(
      (e) => e.user === userId && e.course === courseId
    );
    if (!alreadyEnrolled) {
      enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
      return { _id: uuidv4(), user: userId, course: courseId };
    }
    return enrollments.find((e) => e.user === userId && e.course === courseId);
  }

  function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    const index = enrollments.findIndex(
      (e) => e.user === userId && e.course === courseId
    );
    if (index !== -1) {
      enrollments.splice(index, 1);
      return true;
    }
    return false;
  }

  function findEnrollmentsForUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((e) => e.user === userId);
  }

  function findAllEnrollments() {
    return db.enrollments;
  }

  return { 
    enrollUserInCourse, 
    unenrollUserFromCourse, 
    findEnrollmentsForUser,
    findAllEnrollments
  };
}

