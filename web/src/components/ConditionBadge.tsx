// Maps a raw condition string to a readable label and colour. Full Tailwind class
// strings are written out so the compiler keeps them.
const STYLES: Record<string, { label: string; classes: string }> = {
  new: { label: "New", classes: "bg-green-100 text-green-800" },
  like_new: { label: "Like new", classes: "bg-emerald-100 text-emerald-800" },
  good: { label: "Good", classes: "bg-blue-100 text-blue-800" },
  fair: { label: "Fair", classes: "bg-amber-100 text-amber-800" },
  poor: { label: "Poor", classes: "bg-red-100 text-red-800" },
};

export function ConditionBadge({ condition }: { condition: string }) {
  const style = STYLES[condition] ?? {
    label: condition,
    classes: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style.classes}`}
    >
      {style.label}
    </span>
  );
}
