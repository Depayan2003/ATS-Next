import { Suspense } from "react";
import ApplyForm from "@/ApplyForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApplyForm />
    </Suspense>
  );
}
