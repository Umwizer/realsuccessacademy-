export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? "text-slate-900"}`}>{value}</p>
    </div>
  );
}