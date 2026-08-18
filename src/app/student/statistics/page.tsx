"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getStudentAttendance } from "@/lib/firebase/attendance";
import { getStudentLeaveRequests } from "@/lib/firebase/leave";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "Attendance", href: "/student/attendance" },
  { label: "Ask for Leave", href: "/student/leave" },
  { label: "View Report", href: "/student/report" },
  { label: "Statistics", href: "/student/statistics" },
];

const COLORS = { present: "#16a34a", absent: "#dc2626", late: "#d97706" };

export default function StudentStatisticsPage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell navItems={navItems}><StatsContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function StatsContent() {
  const { profile } = useAuth();
  const [attendanceData, setAttendanceData] = useState<{ name: string; value: number }[]>([]);
  const [leaveData, setLeaveData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    Promise.all([getStudentAttendance(profile.uid), getStudentLeaveRequests(profile.uid)]).then(([attendance, leave]) => {
      const counts = { present: 0, absent: 0, late: 0 };
      attendance.forEach((r) => { counts[r.status]++; });
      setAttendanceData(Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })));

      const leaveCounts = { pending: 0, approved: 0, rejected: 0 };
      leave.forEach((r) => { leaveCounts[r.status]++; });
      setLeaveData(Object.entries(leaveCounts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })));
    }).finally(() => setLoading(false));
  }, [profile]);

  if (loading) return <p className="text-sm text-slate-500">Loading statistics...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Statistics</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
          <p className="mb-4 text-sm font-medium text-slate-900">Attendance Breakdown</p>
          {attendanceData.length === 0 ? <p className="text-sm text-slate-500">No attendance data yet.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {attendanceData.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] ?? "#94a3b8"} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
          <p className="mb-4 text-sm font-medium text-slate-900">Leave Requests</p>
          {leaveData.length === 0 ? <p className="text-sm text-slate-500">No leave requests yet.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={leaveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {leaveData.map((entry) => <Cell key={entry.name} fill={entry.name === "approved" ? "#16a34a" : entry.name === "rejected" ? "#dc2626" : "#d97706"} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}