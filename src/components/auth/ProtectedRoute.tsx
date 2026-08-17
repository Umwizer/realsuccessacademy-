"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/AuthContext";
import type { UserRole } from "@/types/auth";

export function ProtectedRoute({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || !profile || profile.role !== role) router.replace("/login");
  }, [loading, user, profile, role, router]);

  if (loading || !profile || profile.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }
  return <>{children}</>;
}