import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import Application from "@/models/Application";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

   const { jobId } = await params;

  const applications = await Application.find({
    job: jobId,
  }).populate("user");

  return NextResponse.json(applications);
}
