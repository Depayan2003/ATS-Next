import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import Application from "@/models/Application";
import { getToken } from "next-auth/jwt";

export async function PATCH(req, { params }) {
  const { appId } = await params;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  await connectDb();

  await Application.findByIdAndUpdate(appId, { status });

  return NextResponse.json({ message: "Status updated" });
}
