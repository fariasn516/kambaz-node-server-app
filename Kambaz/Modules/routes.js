import ModulesDao from "../Modules/dao.js";
export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);
  const findModulesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      console.log("🔍 Finding modules for course:", courseId);
      const modules = await dao.findModulesForCourse(courseId);
      console.log("✅ Found", modules?.length || 0, "modules");
      res.json(modules || []);
    } catch (error) {
      console.error("❌ Error finding modules:", error);
      res.status(500).json({ error: error.message });
    }
  }
  const createModuleForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const module = {
        ...req.body
      };
      const newModule = await dao.createModule(courseId, module);
      const moduleObj = newModule.toObject ? newModule.toObject() : newModule;
      res.json(moduleObj);
    } catch (error) {
      console.error("❌ Error creating module:", error);
      res.status(500).json({ error: error.message });
    }
  }

  const deleteModule = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const success = await dao.deleteModule(courseId, moduleId);
      if (success) {
        res.json({ success: true, deleted: moduleId });
      } else {
        res.status(404).json({ success: false, message: "Module not found" });
      }
    } catch (error) {
      console.error("❌ Error deleting module:", error);
      res.status(500).json({ error: error.message });
    }
  }
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);

const updateModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const moduleUpdates = req.body;
  const module = await dao.updateModule(courseId, moduleId, moduleUpdates);
  if (module) {
    res.json(module);
  } else {
    res.status(404).json({ message: "Module not found" });
  }
}
app.put("/api/courses/:courseId/modules/:moduleId", updateModule);

app.delete("/api/modules/:moduleId", deleteModule);

  app.post("/api/courses/:courseId/modules", createModuleForCourse);

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
}

