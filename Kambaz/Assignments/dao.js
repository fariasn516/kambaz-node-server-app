import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const createAssignment = async (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    const createdAssignment = await model.create(newAssignment);
    return createdAssignment.toObject ? createdAssignment.toObject() : createdAssignment;
  };

  const findAllAssignments = async () => {
    const assignments = await model.find();
    return assignments.map(a => a.toObject ? a.toObject() : a);
  };

  const findAssignmentsForCourse = async (courseId) => {
    const assignments = await model.find({ course: courseId });
    return assignments.map(a => a.toObject ? a.toObject() : a);
  };

  const findAssignmentById = async (assignmentId) => {
    const assignment = await model.findOne({ _id: assignmentId });
    return assignment?.toObject ? assignment.toObject() : assignment;
  };

  const updateAssignment = async (aid, updates) => {
    const assignment = await model.findOneAndUpdate(
      { _id: aid },
      { $set: updates },
      { new: true }
    );
    return assignment?.toObject ? assignment.toObject() : assignment;
  };

  const deleteAssignment = async (aid) => {
    const result = await model.deleteOne({ _id: aid });
    return result.deletedCount > 0;
  };

  return {
    createAssignment,
    findAllAssignments,
    findAssignmentsForCourse,
    findAssignmentById,
    updateAssignment,
    deleteAssignment,
  };
}
