import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import connectDb from "@/lib/mongodb";
import Job from "@/models/Job";

/**
 * CREATE JOB (ADMIN ONLY)
 */
export async function POST(req) {
  try {
    // 1️⃣ Verify JWT & role
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Connect to DB
    await connectDb();

    // 3️⃣ Parse request body
    const { title, skills, description, expiresAt } = await req.json();

    // 4️⃣ Validate input
    if (!title || !Array.isArray(skills) || skills.length === 0 || !expiresAt) {
      return NextResponse.json(
        { message: "Title, skills and expiry date are required" },
        { status: 400 }
      );
    }

    // 5️⃣ Create job
    const job = await Job.create({
      title,
      skills,
      description,
      expiresAt: new Date(expiresAt)
    });

    // 6️⃣ Return response
    return NextResponse.json(job, { status: 201 });

  } catch (error) {
    console.error("Create Job Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET ALL JOBS (PUBLIC)
 * Optional but useful for job listings
 */
export async function GET() {
  try {
    await connectDb();

    const jobs = await Job.find({
      expiresAt: { $gt: new Date() }, // 🔑 CRITICAL
    }).sort({ createdAt: -1 });

    return NextResponse.json(jobs, { status: 200 });

  } catch (error) {
    console.error("Fetch Jobs Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
