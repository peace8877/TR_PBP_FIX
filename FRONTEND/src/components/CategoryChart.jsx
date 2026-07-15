import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FiGrid } from "react-icons/fi";

const CategoryChart = ({ categories = [] }) => {
  const chartData = useMemo(() => {
    const base = categories.length
      ? categories
      : [
          { name: "Kopi", value: 52 },
          { name: "Non Kopi", value: 28 },
          { name: "Makanan", value: 14 },
          { name: "Lainnya", value: 6 },
        ];

    const palette = ["#6F4E37", "#C89B6D", "#3B2416", "#F8F5F2"];
    const total = base.reduce((acc, c) => acc + c.value, 0) || 1;

    return base.map((c, idx) => ({
      ...c,
      percent: Math.round((c.value / total) * 100),
      fill: palette[idx % palette.length],
    }));
  }, [categories]);

  return (
    <div className="bg-white rounded-3xl border border-white/70 shadow-soft p-5 transition duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-11 w-11 rounded-2xl bg-mokkaCoffee/10 border border-mokkaCoffee/20 flex items-center justify-center">
          <FiGrid className="text-mokkaCoffee text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-mokkaDark">
            Ringkasan Kategori
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Komposisi penjualan berdasarkan kategori
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value) => [`${value}`, "Penjualan"]}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
              <Legend />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius="70%"
                innerRadius="55%"
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {chartData.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between rounded-2xl border border-gray-100 p-3 bg-white/60"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-3.5 w-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.fill }}
                />
                <p className="font-extrabold text-gray-900 truncate">{c.name}</p>
              </div>
              <p className="font-extrabold text-mokkaCoffee">{c.percent}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
