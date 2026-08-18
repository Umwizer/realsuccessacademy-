"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/ui/StatCard";
import { getTeacherDashboardStats } from "@/lib/firebase/stats";

const navItems = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Attendance", href: "/teacher/attendance" },
  { label: "Leave Approval", href: "/teacher/leave-approval" },
  { label: "Add Student", href: "/add-student" },
  { label: "Student Approval", href: "/teacher/student-approval" },
];

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute role="teacher">
      <DashboardShell navItems={navItems}><DashboardContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getTeacherDashboardStats>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherDashboardStats().then(setStats).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Welcome back.</p>
      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading stats...</p>
      ) : stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Students" value={stats.totalStudents} />
          <StatCard label="Present Today" value={stats.presentToday} accent="text-green-600" />
          <StatCard label="Pending Requests" value={stats.pendingRequests} accent="text-amber-600" />
          <StatCard label="Approved Requests" value={stats.approvedRequests} accent="text-blue-600" />
        </div>
      )}
    </div>
  );
}