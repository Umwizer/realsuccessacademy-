"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { getAllLeaveRequests, updateLeaveStatus } from "@/lib/firebase/leave";
import type { LeaveRequest } from "@/types/leave";

const teacherNav = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Attendance", href: "/teacher/attendance" },
  { label: "Leave Approval", href: "/teacher/leave-approval" },
  { label: "Add Student", href: "/add-student" },
  { label: "Student Approval", href: "/teacher/student-approval" },
];

export default function LeaveApprovalPage() {
  return (
    <ProtectedRoute role="teacher">
      <DashboardShell navItems={teacherNav}><LeaveApprovalContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function LeaveApprovalContent() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    getAllLeaveRequests().then(setRequests).catch(() => setError("Failed to load requests.")).finally(() => setLoading(false));
  }, []);

  async function handleAction(id: string, status: "approved" | "rejected") {
    setActingId(id);
    try {
      await updateLeaveStatus(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      setError("Failed to update request.");
    } finally {
      setActingId(null);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading requests...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Leave / Sick Approval</h1>
      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {requests.length === 0 ? <p className="mt-6 text-sm text-slate-500">No leave requests yet.</p> : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500"><tr><th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Reason</th><th className="px-4 py-3 font-medium">Dates</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Action</th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 text-slate-900">{r.studentName}</td>
                  <td className="px-4 py-3 capitalize text-slate-500">{r.type}</td>
                  <td className="px-4 py-3 text-slate-500">{r.reason}</td>
                  <td className="px-4 py-3 text-slate-500">{r.startDate} → {r.endDate}</td>
                  <td className="px-4 py-3"><Badge status={r.status} /></td>
                  <td className="px-4 py-3">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(r.id, "approved")} disabled={actingId === r.id} className="rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50">Approve</button>
                        <button onClick={() => handleAction(r.id, "rejected")} disabled={actingId === r.id} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50">Reject</button>
                      </div>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}