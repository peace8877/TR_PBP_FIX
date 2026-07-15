import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { FiFilter } from "react-icons/fi";

const SalesChart = ({ data = [], title = "Grafik Penjualan" }) => {
  const [range, setRange] = useState("7");

  const chartData = useMemo(() => {
    // dummy: data sudah 7 hari, jadi filter hanya UI/behavior
    // jika nanti data lebih panjang, bisa di-slice sesuai range
    if (!Array.isArray(data) || data.length === 0) return [];
    return range === "7" ? data : data;
  }, [data, range]);

  return (
    <div className="bg-white rounded-3xl border border-white/70 shadow-soft p-5 transition duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-mokkaDark">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Visualisasi tren penjualan bisnis Anda</p>
        </div>

        <div className="flex items-center gap-2 rounded-3xl border border-gray-100 bg-mokkaCream/60 px-3 py-2">
          <FiFilter className="text-mokkaCoffee text-lg" />
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-transparent outline-none text-sm font-bold text-mokkaCoffee"
            aria-label="Filter penjualan"
          >
            <option value="7">7 Hari Terakhir</option>
          </select>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#EAEAEA" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
              formatter={(value) => [`${value}`, "Penjualan"]}
              labelFormatter={(label) => `Tanggal: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6F4E37"
              strokeWidth={3}
              dot={{ r: 4, fill: "#C89B6D", stroke: "#6F4E37", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
