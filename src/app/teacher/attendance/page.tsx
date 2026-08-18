"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getAllStudents } from "@/lib/firebase/students";
import { markAttendance, getTodayAttendance } from "@/lib/firebase/attendance";
import type { AttendanceStatus } from "@/types/attendance";

const teacherNav = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Attendance", href: "/teacher/attendance" },
  { label: "Leave Approval", href: "/teacher/leave-approval" },
  { label: "Add Student", href: "/add-student" },
  { label: "Student Approval", href: "/teacher/student-approval" },
];

interface StudentRow { uid: string; name: string; email: string; }

export default function TeacherAttendancePage() {
  return (
    <ProtectedRoute role="teacher">
      <DashboardShell navItems={teacherNav}><AttendanceContent /></DashboardShell>
    </ProtectedRoute>
  );
}

function AttendanceContent() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllStudents(), getTodayAttendance()])
      .then(([studentList, todayRecords]) => {
        setStudents(studentList as StudentRow[]);
        const existing: Record<string, AttendanceStatus> = {};
        (todayRecords as any[]).forEach((r) => { existing[r.studentId] = r.status; });
        setMarks(existing);
      })
      .catch(() => setError("Failed to load students. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  async function handleMark(student: StudentRow, status: AttendanceStatus) {
    if (!profile) return;
    setSavingId(student.uid);
    try {
      await markAttendance(student.uid, student.name, status, profile.uid);
      setMarks((prev) => ({ ...prev, [student.uid]: status }));
    } catch {
      setError("Failed to save attendance. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading students...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
      <p className="mt-1 text-sm text-slate-500">Mark today&apos;s attendance for each student.</p>
      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {students.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No students yet. Add one from &quot;Add Student&quot;.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500">
              <tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Mark</th></tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.uid} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 text-slate-900">{student.name}</td>
                  <td className="px-4 py-3 text-slate-500">{student.email}</td>
                  <td className="px-4 py-3">{marks[student.uid] ? <span className="capitalize text-slate-700">{marks[student.uid]}</span> : <span className="text-slate-400">Not marked</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(["present", "absent", "late"] as AttendanceStatus[]).map((status) => (
                        <button key={status} onClick={() => handleMark(student, status)} disabled={savingId === student.uid}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-medium capitalize disabled:opacity-50 ${marks[student.uid] === status ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                          {status}
                        </button>
                      ))}
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