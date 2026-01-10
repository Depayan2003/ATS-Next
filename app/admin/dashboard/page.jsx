"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">
          Admin Dashboard
        </h1>

        <p className="mb-2">
          <strong>Name:</strong> {session.user.name}
        </p>

        <p className="mb-2">
          <strong>Email:</strong> {session.user.email}
        </p>

        <p className="mb-4 text-red-600 font-semibold">
          Role: ADMIN
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
