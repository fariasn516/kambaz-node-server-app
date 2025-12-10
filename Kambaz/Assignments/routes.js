import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const createAssignment = async (req, res) => {
    try {
      const assignment = await dao.createAssignment(req.body);
      res.json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const createAssignmentForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = { ...req.body, course: courseId };
      const createdAssignment = await dao.createAssignment(assignment);
      res.json(createdAssignment);
    } catch (error) {
      console.error("Error creating assignment for course:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const findAllAssignments = async (req, res) => {
    try {
      const assignments = await dao.findAllAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error finding assignments:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error("Error finding assignments for course:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const findAssignmentById = async (req, res) => {
    try {
      const { aid } = req.params;
      const assignment = await dao.findAssignmentById(aid);
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      console.error("Error finding assignment:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const { aid } = req.params;
      const assignment = await dao.updateAssignment(aid, req.body);
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const deleteAssignment = async (req, res) => {
    try {
      const { aid } = req.params;
      const success = await dao.deleteAssignment(aid);
      if (success) {
        res.json({ success: true, deleted: aid });
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({ error: error.message });
    }
  };

  app.post("/api/assignments", createAssignment);
  app.get("/api/assignments", findAllAssignments);
  app.get("/api/assignments/:aid", findAssignmentById);
  app.put("/api/assignments/:aid", updateAssignment);
  app.delete("/api/assignments/:aid", deleteAssignment);
  
  // Course-specific routes
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
}
