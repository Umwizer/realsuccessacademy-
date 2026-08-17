"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "Attendance", href: "/student/attendance" },
  { label: "Ask for Leave", href: "/student/leave" },
  { label: "View Report", href: "/student/report" },
  { label: "Statistics", href: "/student/statistics" },
];

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell navItems={navItems}>
        <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back.</p>
      </DashboardShell>
    </ProtectedRoute>
  );
}