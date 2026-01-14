import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDb from "@/lib/mongodb";
import Application from "@/models/Application";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const applications = await Application.find({
      user: session.user.id,
    })
      .populate("job", "title skills") // fetch job details
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
