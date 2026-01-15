import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        skills: {
            type: [String],
            required: true
        },
        description: {
            type: String
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true
    }
)
JobSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export default mongoose.models.job || mongoose.model("job", JobSchema)