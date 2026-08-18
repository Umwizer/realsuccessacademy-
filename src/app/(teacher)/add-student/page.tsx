import { AddStudentForm } from "@/components/teacher/AddStudentForm";

export default function AddStudentPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Add Student</h1>
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <AddStudentForm />
        </div>
      </div>
    </div>
  );
}