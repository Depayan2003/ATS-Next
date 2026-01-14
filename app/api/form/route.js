import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    // ✅ READ BODY FIRST (ONLY ONCE)
    const formData = await req.formData();

    const jobId = formData.get("jobId");
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const photo = formData.get("photo");
    const resume = formData.get("resume");

    console.log("JOB ID RECEIVED >>>", jobId);

    if (!jobId || !photo || !resume|| !fullName || !email || !phone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ THEN DO AUTH
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ THEN CONNECT DB
    await connectDb();

    const existingApplication = await Application.findOne({
      user: session.user.id,
      job: jobId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied for this job." },
        { status: 409 }
      );
    }


    /* ---------- PHOTO UPLOAD ---------- */
    const photoBuffer = Buffer.from(await photo.arrayBuffer());

    const photoUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "ats/photos", resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      ).end(photoBuffer);
    });

    /* ---------- RESUME UPLOAD ---------- */
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());

    const resumeUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "ats/resumes", resource_type: "raw" },
        (err, result) => (err ? reject(err) : resolve(result))
      ).end(resumeBuffer);
    });

    const application = await Application.create({
      user: session.user.id,
      job: jobId,
      fullName,
      email,
      phone,
      photo: {
        url: photoUpload.secure_url,
        publicId: photoUpload.public_id,
      },
      resume: {
        url: resumeUpload.secure_url,
        publicId: resumeUpload.public_id,
      },
    });

    return NextResponse.json(
      { message: "Application submitted", application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
