export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
}