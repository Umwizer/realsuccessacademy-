"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getStudentAttendance } from "@/lib/firebase/attendance";
import {type  AttendanceRecord } from "@/types/attendance";

const studentNav = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "Attendance", href: "/student/attendance" },
  { label: "Ask for Leave", href: "/student/leave" },
  { label: "View Report", href: "/student/report" },
  { label: "Statistics", href: "/student/statistics" },
];

export default function StudentAttendancePage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell navItems={studentNav}><AttendanceContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function AttendanceContent() {
  const { profile } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    getStudentAttendance(profile.uid).then(setRecords).catch(() => setError("Failed to load attendance.")).finally(() => setLoading(false));
  }, [profile]);

  const percentage = records.length ? Math.round((records.filter((r) => r.status === "present").length / records.length) * 100) : 0;

  if (loading) return <p className="text-sm text-slate-500">Loading attendance...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-6">
        <p className="text-sm text-slate-500">Attendance Percentage</p>
        <p className="mt-1 text-3xl font-bold text-blue-600">{percentage}%</p>
      </div>
      {records.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No attendance records yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500"><tr><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 text-slate-900">{r.date}</td>
                  <td className="px-4 py-3"><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}