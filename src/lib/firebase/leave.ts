import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { LeaveType, LeaveRequest } from "@/types/leave";

export async function submitLeaveRequest(params: {
  studentId: string; studentName: string; type: LeaveType; reason: string; startDate: string; endDate: string;
}) {
  await addDoc(collection(db, "leaveRequests"), { ...params, status: "pending", createdAt: Date.now() });
}

export async function getStudentLeaveRequests(studentId: string) {
  const q = query(collection(db, "leaveRequests"), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  return (snap.docs.map((d) => ({ id: d.id, ...d.data() })) as LeaveRequest[]).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getAllLeaveRequests() {
  const snap = await getDocs(collection(db, "leaveRequests"));
  return (snap.docs.map((d) => ({ id: d.id, ...d.data() })) as LeaveRequest[]).sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateLeaveStatus(id: string, status: "approved" | "rejected") {
  await updateDoc(doc(db, "leaveRequests", id), { status });
}