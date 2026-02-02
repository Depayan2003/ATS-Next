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
    degree: {
      type: String,
      enum: ["BTECH_BE", "MTECH_ME"],
      required: true,
    },
    stream: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    ai: {
      similarityScore: Number,
      finalScore: Number,
      decision: {
        type: String,
        enum: ["SHORTLISTED", "REJECTED", "REVIEW"],
      },
      modelVersion: String,
      evaluatedAt: Date,
    }
  },
  { timestamps: true }
);

ApplicationSchema.index(
  { user: 1, job: 1 },
  { unique: true }
);

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
