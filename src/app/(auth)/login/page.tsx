import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            S
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Real Success Academy</h1>
          <p className="mt-1 text-sm text-slate-500">Student Management System</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Sign in to your account</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}