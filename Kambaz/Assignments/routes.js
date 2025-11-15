import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  app.post("/api/assignments", (req, res) => {
    const assignment = dao.createAssignment(req.body);
    res.json(assignment);
  });

  app.get("/api/assignments", (req, res) => {
    const all = dao.findAllAssignments();
    res.json(all);
  });

  app.put("/api/assignments/:aid", (req, res) => {
    dao.updateAssignment(req.params.aid, req.body);
    res.sendStatus(204);
  });

  app.delete("/api/assignments/:aid", (req, res) => {
    dao.deleteAssignment(req.params.aid);
    res.sendStatus(204);
  });
}
