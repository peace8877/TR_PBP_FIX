const StatCard = ({ icon: Icon, title, value, growthPercent, growthLabel }) => {
  return (
    <div className="bg-white rounded-3xl border border-white/70 shadow-soft p-6 transition duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-mokkaDark truncate">
            {value}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold border border-emerald-100">
              <span className="text-emerald-600">▲</span> {growthPercent}
            </span>
            <span className="text-xs font-semibold text-gray-500">{growthLabel}</span>
          </div>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-mokkaCoffee/10 border border-mokkaCoffee/20 flex items-center justify-center shrink-0">
          {Icon ? <Icon className="text-xl sm:text-2xl text-mokkaCoffee" /> : null}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
