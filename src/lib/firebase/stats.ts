import { getAllStudents } from "@/lib/firebase/students";
import { getTodayAttendance } from "@/lib/firebase/attendance";
import { getAllLeaveRequests } from "@/lib/firebase/leave";

export async function getTeacherDashboardStats() {
  const [students, todayAttendance, leaveRequests] = await Promise.all([
    getAllStudents(),
    getTodayAttendance(),
    getAllLeaveRequests(),
  ]);

  const presentToday = todayAttendance.filter((r: any) => r.status === "present").length;
  const pending = leaveRequests.filter((r) => r.status === "pending").length;
  const approved = leaveRequests.filter((r) => r.status === "approved").length;
  const rejected = leaveRequests.filter((r) => r.status === "rejected").length;

  return {
    totalStudents: students.length,
    presentToday,
    absentToday: todayAttendance.length - presentToday,
    markedToday: todayAttendance.length,
    pendingRequests: pending,
    approvedRequests: approved,
    rejectedRequests: rejected,
  };
}