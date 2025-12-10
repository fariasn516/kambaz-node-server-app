import moduleModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const module = await moduleModel.findOne({ _id: moduleId, course: courseId });
    if (!module) return null;
    Object.assign(module, moduleUpdates);
    await module.save();
    return module.toObject ? module.toObject() : module;
  }

  async function deleteModule(courseId, moduleId) {
    const result = await moduleModel.deleteOne({ _id: moduleId, course: courseId });
    return result.deletedCount > 0;
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    const createdModule = await moduleModel.create(newModule);
    return createdModule.toObject ? createdModule.toObject() : createdModule;
  }

  async function findModulesForCourse(courseId) {
    const modules = await moduleModel.find({ course: courseId });
    return modules.map(m => m.toObject ? m.toObject() : m);
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule
  };
}

