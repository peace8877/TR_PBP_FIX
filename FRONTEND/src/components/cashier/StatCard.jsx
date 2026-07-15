function StatCard({ label, value, icon, variant = "coffee" }) {
  const variantMap = {
    coffee: "bg-mokkaCream/60 border-mokkaCoffee/20 text-mokkaDark",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div
      className={[
        "rounded-3xl border shadow-sm p-5 flex items-start gap-4",
        variantMap[variant] || variantMap.coffee,
      ].join(" ")}
    >
      <div className="h-12 w-12 rounded-2xl bg-white/60 border border-white/70 flex items-center justify-center">
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default StatCard;

