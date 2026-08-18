export type LeaveType = "sick" | "family" | "medical" | "personal" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: LeaveType;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  teacherResponse?: string;
  createdAt: number;
}