"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch(`/api/applications/job/${jobId}`)
      .then(res => res.json())
      .then(data => setApps(data));
  }, [jobId]);

  const updateStatus = async (appId, newStatus) => {
    await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    // update UI
    setApps(prev =>
      prev.map(a =>
        a._id === appId ? { ...a, status: newStatus } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">
        Applications for Job
      </h1>

      {apps.length === 0 && <p>No applications yet.</p>}

      {apps.map(app => (
        <div key={app._id} className="bg-white p-4 mb-3 rounded shadow">
          <p><b>Name:</b> {app.fullName}</p>
          <p><b>Email:</b> {app.email}</p>
          <p><b>Status:</b> {app.status}</p>

          {/* Resume link */}
          <p>
            <b>Resume:</b>{" "}
            <a
              href={app.resume.url}
              target="_blank"
              className="text-blue-600 underline"
            >
              view resume
            </a>
          </p>

          {/* AI Info */}
          {app.ai && (
            <>
              <p><b>AI Skill Score:</b> {app.ai.similarityScore}</p>
              <p><b>AI Final Score:</b> {app.ai.finalScore}</p>
              <p><b>AI Decision:</b> {app.ai.decision}</p>
            </>
          )}

          {/* Admin controls */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => updateStatus(app._id, "SHORTLISTED")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Shortlist
            </button>

            <button
              onClick={() => updateStatus(app._id, "REJECTED")}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>

            <button
              onClick={() => updateStatus(app._id, "APPLIED")}
              className="bg-gray-600 text-white px-3 py-1 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
