"use client";

import { GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type Role = "student" | "teacher";

interface RoleToggleProps {
  value: Role;
  onChange: (role: Role) => void;
}

const options: { value: Role; label: string; icon: typeof User }[] = [
  { value: "student", label: "Student", icon: User },
  { value: "teacher", label: "Teacher", icon: GraduationCap },
];

export function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Select account type"
      className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
    >
      {options.map(({ value: optionValue, label, icon: Icon }) => {
        const isActive = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(optionValue)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}