import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: String, // stores User.email
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

messageSchema.virtual("userDetails", {
  ref: "User",
  localField: "user",
  foreignField: "email",
  justOne: true,
});

export default mongoose.model("Message", messageSchema);
