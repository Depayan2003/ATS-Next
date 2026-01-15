"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setexpiresAt] = useState("")
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  const handleAddJob = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        skills: skills.split(",").map((s) => s.trim()),
        description,
        expiresAt
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.message || "Failed to add job");
      return;
    }

    setMessage("Job posted successfully");
    setTitle("");
    setSkills("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Manage job postings and recruitment flow
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Admin Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Admin Profile
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {session.user.name}
              </p>

              <p className="text-red-600 font-semibold">
                Role: ADMIN
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          {/* Add Job Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Post a New Job
            </h2>

            {message && (
              <div className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
                {message}
              </div>
            )}

            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Job Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title of the job"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Required Skills:
                </label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g : React, Next.js, Tailwind"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Job Description:
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe responsibilities and expectations"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Expiry Date
                </label>

                <input
                  type="date"
                  required
                  onChange={(e) => setexpiresAt(e.target.value)}
                  className="w-full border p-2 rounded"
                />

              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Posting Job..." : "Post Job"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
