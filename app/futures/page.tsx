"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import FutureDetailView from "@/app/components/futures/FutureDetailView";
import { Atom } from "react-loading-indicators";

function FuturesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const id = searchParams.get("id")?.trim() ?? "";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !id) {
      router.replace("/?section=futures");
    }
  }, [isAuthenticated, id, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return <FutureDetailView futureId={id} />;
}

export default function FuturesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      }
    >
      <FuturesPageInner />
    </Suspense>
  );
}
