"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

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
      <DashboardShell navItems={navItems}>
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back.</p>
      </DashboardShell>
    </ProtectedRoute>
  );
}