"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RoleToggle, type Role } from "@/components/auth/RoleToggle";
import {auth} from '@/lib/firebase/config'
interface FormErrors {
  email?: string;
  password?: string;
}
console.log("Firebase auth initialized:", auth.app.name);
export function LoginForm() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
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
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO (next step): call real auth service here, e.g.
      // await signIn({ role, email, password })
      await new Promise((resolve) => setTimeout(resolve, 800)); // placeholder
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <RoleToggle value={role} onChange={setRole} />

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