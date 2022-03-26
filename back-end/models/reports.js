import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema(
  {
    includeSS: { type: Boolean, default: false },
    includeAL: { type: Boolean, default: false },
    includePR: { type: Boolean, default: false },
    includeApps: { type: Boolean, default: false },
    share: { type: Boolean, default: true },
    schedule: { type: Boolean, default: true },
    scheduleType: { type: String, default: "weekly" },
    scheduledTime: { type: mongoose.Schema.Types.Mixed },
    // dateRange: [{ type: String }],
    // employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
    // projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    name: { type: String, default: "no name" },
    fileName: { type: String, unique: "true" },
    // groupBy: { type: String },
    url: { type: String, unique: "true" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    options: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Reports = mongoose.model("Reports", reportsSchema);

export default Reports;
