export type UserRole = "student" | "teacher";
export type UserStatus = "pending" | "approved" | "rejected";

export interface UserProfile {
  uid: string;
  role: UserRole;
  status: UserStatus;
  name: string;
  email: string;
}