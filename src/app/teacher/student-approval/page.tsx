"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getPendingStudents, updateStudentStatus } from "@/lib/firebase/students";

const teacherNav = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Attendance", href: "/teacher/attendance" },
  { label: "Leave Approval", href: "/teacher/leave-approval" },
  { label: "Add Student", href: "/add-student" },
  { label: "Student Approval", href: "/teacher/student-approval" },
];

interface PendingStudent { uid: string; name: string; email: string; }

export default function StudentApprovalPage() {
  return (
    <ProtectedRoute role="teacher">
      <DashboardShell navItems={teacherNav}><ApprovalContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function ApprovalContent() {
  const [students, setStudents] = useState<PendingStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    getPendingStudents().then((data) => setStudents(data as PendingStudent[])).catch(() => setError("Failed to load pending students.")).finally(() => setLoading(false));
  }, []);

  async function handleAction(uid: string, status: "approved" | "rejected") {
    setActingId(uid);
    try {
      await updateStudentStatus(uid, status);
      setStudents((prev) => prev.filter((s) => s.uid !== uid));
    } catch {
      setError("Failed to update student.");
    } finally {
      setActingId(null);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Student Approval</h1>
      <p className="mt-1 text-sm text-slate-500">Students awaiting account approval.</p>
      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {students.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No pending approvals. (Students added via &quot;Add Student&quot; are auto-approved — this queue is for a self-registration flow not yet built.)</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500"><tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Action</th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.uid} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-500">{s.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(s.uid, "approved")} disabled={actingId === s.uid} className="rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50">Approve</button>
                      <button onClick={() => handleAction(s.uid, "rejected")} disabled={actingId === s.uid} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50">Reject</button>
                    </div>
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