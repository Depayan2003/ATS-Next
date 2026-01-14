import mongoose from "mongoose";

const JobSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        skills:{
            type:[String],
            required:true
        },
        description:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

export default mongoose.models.job||mongoose.model("job",JobSchema)