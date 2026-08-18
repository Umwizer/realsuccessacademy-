"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getStudentReports } from "@/lib/firebase/reports";
import type { ReportEntry } from "@/types/report";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "Attendance", href: "/student/attendance" },
  { label: "Ask for Leave", href: "/student/leave" },
  { label: "View Report", href: "/student/report" },
  { label: "Statistics", href: "/student/statistics" },
];

export default function StudentReportPage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell navItems={navItems}><ReportContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function ReportContent() {
  const { profile } = useAuth();
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    getStudentReports(profile.uid).then(setReports).catch(() => setError("Failed to load reports.")).finally(() => setLoading(false));
  }, [profile]);

  const average = reports.length ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length) : 0;

  if (loading) return <p className="text-sm text-slate-500">Loading report...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">View Report</h1>
      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-6">
        <p className="text-sm text-slate-500">Average Score</p>
        <p className="mt-1 text-3xl font-bold text-blue-600">{average}%</p>
      </div>
      {reports.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No report entries yet. Your teacher hasn&apos;t added any scores.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500"><tr><th className="px-4 py-3 font-medium">Subject</th><th className="px-4 py-3 font-medium">Term</th><th className="px-4 py-3 font-medium">Score</th></tr></thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 text-slate-900">{r.subject}</td>
                  <td className="px-4 py-3 text-slate-500">{r.term}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}