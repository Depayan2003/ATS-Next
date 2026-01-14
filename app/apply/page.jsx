"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const jobId = params.get("jobId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) {
      router.push("/user/dashboard");
    }
  }, [jobId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    formData.append("jobId", jobId);

    try {
      const res = await fetch("/api/form", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      router.push("/user/dashboard?success=applied");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Job Application
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input name="fullName" required placeholder="Full Name" className="w-full border p-2 mb-3" />
        <input name="email" type="email" required placeholder="Email" className="w-full border p-2 mb-3" />
        <input name="phone" required placeholder="Phone" className="w-full border p-2 mb-3" />

        <input name="photo" type="file" accept="image/*" required className="mb-3" />
        <input name="resume" type="file" accept=".pdf" required className="mb-5" />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
