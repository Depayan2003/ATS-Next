"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">
            ATS Job Portal
          </h1>

          <p className="text-gray-600 mb-6">
            Apply for jobs, track applications — all in one place.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-medium"
            >
              Register
            </button>
          </div>
        </div>

        {/* Jobs Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Available Jobs
          </h2>

          {loading && (
            <p className="text-gray-500">Loading jobs...</p>
          )}

          {!loading && jobs.length === 0 && (
            <p className="text-gray-500">
              No job openings available at the moment.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border rounded-lg shadow-sm p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {job.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {job.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                )}

                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
