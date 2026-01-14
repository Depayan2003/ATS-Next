import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    photo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    resume: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "REJECTED"],
      default: "APPLIED",
    },
  },
  { timestamps: true }
);

ApplicationSchema.index(
  { user: 1, job: 1 },
  { unique: true }
);

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
