import { Suspense } from "react";
import UserDashboardClient from "./UserDashboardClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading dashboard...</div>}>
      <UserDashboardClient />
    </Suspense>
  );
}
