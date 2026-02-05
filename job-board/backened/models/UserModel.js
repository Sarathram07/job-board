import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
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
    name: {
      type: String, // UUID of Company
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

/* 🔗 Virtual: User → Company (many → 1) */
userSchema.virtual("company", {
  ref: "Company",
  localField: "companyId",
  foreignField: "id",
  justOne: true,
});

/* ✅ Enable virtuals in responses */
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

export default mongoose.model("User", userSchema);
