import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function getAllStudents() {
  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function getPendingStudents() {
  const q = query(collection(db, "users"), where("role", "==", "student"), where("status", "==", "pending"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function updateStudentStatus(uid: string, status: "approved" | "rejected") {
  await updateDoc(doc(db, "users", uid), { status });
}