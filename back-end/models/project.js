import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, unique: "true" },
    notified: { type: Boolean, default: false },
    consumeTime: { type: Number, default: 0 },
    budgetTime: { type: Number, default: 0 },
    projectLeader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
