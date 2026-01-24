import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const jobSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
    },
    companyId: {
      type: String, // UUID of Company
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

/* 🔗 Virtual: Job → Company (many → many) */
jobSchema.virtual("company", {
  ref: "Company",
  localField: "companyId",
  foreignField: "id",
  justOne: false,
});

/* ✅ Enable virtuals in responses */
jobSchema.set("toObject", { virtuals: true });
jobSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Job", jobSchema);
