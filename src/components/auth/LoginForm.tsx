"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RoleToggle, type Role } from "@/components/auth/RoleToggle";
import { signInUser, getUserProfile, signOutUser } from "@/lib/firebase/auth";

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address";
    if (!password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await signInUser(email, password);
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        await signOutUser();
        setFormError("No profile found for this account. Contact your administrator.");
        return;
      }
      if (profile.status !== "approved") {
        await signOutUser();
        setFormError(
          profile.status === "pending"
            ? "Your account is pending approval."
            : "Your account request was rejected. Contact your administrator."
        );
        return;
      }
      if (profile.role !== role) {
        await signOutUser();
        setFormError(`This account is registered as a ${profile.role}. Please select that tab.`);
        return;
      }

      router.push(profile.role === "student" ? "/student/dashboard" : "/teacher/dashboard");
    } catch (error) {
      console.error("LOGIN DEBUG:", error); // temporary — remove once confirmed working
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <RoleToggle value={role} onChange={setRole} />

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder={role === "student" ? "student@school.edu" : "teacher@school.edu"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <Input
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPassword ? "Hide" : "Show"}
          </button>
        }
      />

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign in as {role === "student" ? "Student" : "Teacher"}
      </Button>

      <p className="text-center text-xs text-slate-400">
        Your password was sent to your email upon registration.
      </p>
    </form>
  );
}