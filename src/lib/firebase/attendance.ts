import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { AttendanceStatus, AttendanceRecord } from "@/types/attendance";

export async function markAttendance(studentId: string, studentName: string, status: AttendanceStatus, markedBy: string) {
  const today = new Date().toISOString().split("T")[0];
  await setDoc(doc(db, "attendance", `${studentId}_${today}`), {
    studentId, studentName, date: today, status, markedBy,
  });
}

export async function getStudentAttendance(studentId: string) {
  const q = query(collection(db, "attendance"), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  const records = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AttendanceRecord[];
  return records.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getTodayAttendance() {
  const today = new Date().toISOString().split("T")[0];
  const q = query(collection(db, "attendance"), where("date", "==", today));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}