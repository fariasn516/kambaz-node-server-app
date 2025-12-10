import mongoose from "mongoose";
import schema from "./schema.js";

const moduleSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
  lessons: [{ _id: String, name: String, description: String, module: String }],
}, { collection: "modules" });

const model = mongoose.model("ModuleModel", moduleSchema);
export default model;

