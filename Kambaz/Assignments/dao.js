let assignments = [];

const AssignmentsDao = () => {
  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: new Date().getTime().toString() };
    assignments.push(newAssignment);
    return newAssignment;
  };

  const findAllAssignments = () => assignments;

  const updateAssignment = (aid, updates) => {
    assignments = assignments.map((a) => a._id === aid ? { ...a, ...updates } : a);
  };

  const deleteAssignment = (aid) => {
    assignments = assignments.filter((a) => a._id !== aid);
  };

  return {
    createAssignment,
    findAllAssignments,
    updateAssignment,
    deleteAssignment,
  };
};

export default AssignmentsDao;
