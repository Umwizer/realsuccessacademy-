import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  present: "bg-green-50 text-green-700 border-green-200",
  absent: "bg-red-50 text-red-700 border-red-200",
  late: "bg-amber-50 text-amber-700 border-amber-200",
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", styles[status] ?? "bg-slate-50 text-slate-700 border-slate-200")}>
      {status}
    </span>
  );
}