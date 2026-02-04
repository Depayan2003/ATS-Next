"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get("success");

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Auth protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session.user.role !== "USER") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // Clear success param
  useEffect(() => {
    if (success === "applied") {
      const t = setTimeout(() => {
        router.replace("/user/dashboard");
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [success, router]);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch my applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications/my");
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApplications();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {success === "applied" && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded">
            Application submitted successfully.
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {session.user.name}
            </h1>
            <p className="text-sm text-gray-600">
              Browse available jobs and apply directly
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Jobs */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Available Jobs
          </h2>

          {loadingJobs && <p className="text-gray-500">Loading jobs...</p>}

          {!loadingJobs && jobs.length === 0 && (
            <p className="text-gray-500">No jobs available.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-blue-100 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Expires: {new Date(job.expiresAt).toLocaleDateString()}
                </p>

                <button
                  onClick={() => router.push(`/apply?jobId=${job._id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Applications */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Your Applications
          </h2>

          {loadingApps && <p className="text-gray-500">Loading...</p>}

          {!loadingApps && applications.length === 0 && (
            <p className="text-gray-500">No applications yet.</p>
          )}

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-4 rounded shadow flex justify-between">
                <div>
                  <h3 className="font-semibold">
                    {app.job?.title || "Job removed"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="font-semibold">{app.status}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
