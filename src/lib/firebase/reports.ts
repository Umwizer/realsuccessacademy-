import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { ReportEntry } from "@/types/report";

export async function getStudentReports(studentId: string) {
  const q = query(collection(db, "reports"), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ReportEntry[];
}