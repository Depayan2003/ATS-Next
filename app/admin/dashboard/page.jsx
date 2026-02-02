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
  const [expiresAt, setExpiresAt] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(setJobs);
  }, []);

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
    setExpiresAt("");
    setJobs([data, ...jobs]);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">
              Manage job openings and applications
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Add Job */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Post New Job
            </h2>

            {message && (
              <div className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
                {message}
              </div>
            )}

            <form onSubmit={handleAddJob} className="space-y-4">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Job Title"
              />

              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Skills (comma separated)"
              />

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Job description"
              />

              <input
                type="date"
                required
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>

          {/* Jobs List */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Active Jobs
            </h2>

            <div className="space-y-3">
              {jobs.map(job => (
                <div
                  key={job._id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-xs text-gray-500">
                      Expires: {new Date(job.expiresAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/admin/jobs/${job._id}/applications`)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View Applications
                  </button>
                </div>
              ))}

              {jobs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No jobs posted yet.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
