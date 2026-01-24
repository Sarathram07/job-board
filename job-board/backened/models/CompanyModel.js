import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const companySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
  },
  {
    timestamps: true,
  },
);

/* 🔗 Virtual: Company → Jobs (1 → many) */
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "id",
  foreignField: "companyId",
  justOne: false,
});

/* 🔗 Virtual: Company → Users (1 → many) */
companySchema.virtual("users", {
  ref: "User",
  localField: "id",
  foreignField: "companyId",
  justOne: false,
});

/* ✅ Enable virtuals in responses */
companySchema.set("toObject", { virtuals: true });
companySchema.set("toJSON", { virtuals: true });

export default mongoose.model("Company", companySchema);
