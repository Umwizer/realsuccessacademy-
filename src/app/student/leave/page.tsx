"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/firebase/AuthContext";
import { submitLeaveRequest, getStudentLeaveRequests } from "@/lib/firebase/leave";
import type { LeaveRequest, LeaveType } from "@/types/leave";

const studentNav = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "Attendance", href: "/student/attendance" },
  { label: "Ask for Leave", href: "/student/leave" },
  { label: "View Report", href: "/student/report" },
  { label: "Statistics", href: "/student/statistics" },
];

const LEAVE_TYPE_OPTIONS: { value: LeaveType; label: string }[] = [
  { value: "sick", label: "Sick" },
  { value: "family", label: "Family Issue" },
  { value: "medical", label: "Medical Appointment" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

export default function StudentLeavePage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell navItems={studentNav}><LeaveContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function LeaveContent() {
  const { profile } = useAuth();
  const [type, setType] = useState<LeaveType>("sick");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!profile) return;
    getStudentLeaveRequests(profile.uid).then(setRequests).finally(() => setLoading(false));
  }, [profile]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setMessage(null);
    if (!reason.trim() || !startDate || !endDate) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }
    setSubmitting(true);
    try {
      await submitLeaveRequest({ studentId: profile.uid, studentName: profile.name, type, reason, startDate, endDate });
      setMessage({ type: "success", text: "Leave request submitted." });
      setReason(""); setStartDate(""); setEndDate("");
      setRequests(await getStudentLeaveRequests(profile.uid));
    } catch {
      setMessage({ type: "error", text: "Failed to submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Ask for Leave</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4 rounded-2xl border border-slate-100 bg-white p-6">
        {message && <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600"}`}>{message.text}</div>}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-900">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <Input label="Reason" name="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        <Input label="Start date" name="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input label="End date" name="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <Button type="submit" isLoading={submitting} className="w-full">Submit Request</Button>
      </form>
      <h2 className="mt-8 text-lg font-semibold text-slate-900">Your Requests</h2>
      {loading ? <p className="mt-2 text-sm text-slate-500">Loading...</p> : requests.length === 0 ? <p className="mt-2 text-sm text-slate-500">No requests yet.</p> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500"><tr><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Dates</th><th className="px-4 py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {requests.map((r) => {
                const label = LEAVE_TYPE_OPTIONS.find((o) => o.value === r.type)?.label ?? r.type;
                return (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 text-slate-900">{label}</td>
                    <td className="px-4 py-3 text-slate-500">{r.startDate} → {r.endDate}</td>
                    <td className="px-4 py-3"><Badge status={r.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}