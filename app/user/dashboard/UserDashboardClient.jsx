"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get("success");

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session.user.role !== "USER") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (success === "applied") {
      const timeout = setTimeout(() => {
        router.replace("/user/dashboard");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [success, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

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

        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {session.user.name}
            </h1>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Jobs + Applications sections stay exactly as you wrote */}
        {/* (No logic changes needed) */}
      </div>
    </div>
  );
}
