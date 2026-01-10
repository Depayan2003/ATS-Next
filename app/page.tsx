"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-3xl font-semibold mb-6">
          ATS Portal
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
}
