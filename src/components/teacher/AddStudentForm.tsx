"use client";

import { FormEvent, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AddStudentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMessage({ type: "error", text: "You must be signed in." });
        return;
      }
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/students/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, grade }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Something went wrong" });
        return;
      }

      setMessage({
        type: data.emailSent ? "success" : "error",
        text: data.emailSent
          ? `${name} added. Login details sent to ${email}.`
          : `${name} was added, but the email failed to send (Resend test-mode limitation). Check the server terminal for the generated password.`,
      });
      setName("");
      setEmail("");
      setGrade("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}
      <Input label="Full name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Email address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Grade / Class (optional)" name="grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
      <Button type="submit" isLoading={isLoading} className="w-full">Add Student</Button>
    </form>
  );
}