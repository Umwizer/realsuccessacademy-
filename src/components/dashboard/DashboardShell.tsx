"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOutUser } from "@/lib/firebase/auth";

interface NavItem {
  label: string;
  href: string;
}

export function DashboardShell({
  navItems,
  children,
}: {
  navItems: NavItem[];
  children: ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await signOutUser();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="hidden w-64 flex-col border-r border-slate-100 bg-white p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">S</div>
          <span className="font-semibold text-slate-900">Success Academy</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 md:hidden">
          <span className="font-semibold text-slate-900">Success Academy</span>
          <button onClick={handleLogout} className="text-sm text-slate-500">Logout</button>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}