import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatDateLabel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export default function WeightHistoryChart({ data = [] }) {
  const chartData = (Array.isArray(data) ? data : []).map((point) => ({
    ...point,
    label: formatDateLabel(point.recordedAt),
  }));

  if (chartData.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-8 text-center text-sm text-[var(--text)]">
        Registrá tu peso para ver la evolución aquí.
      </p>
    );
  }

  const weights = chartData.map((p) => p.weightKg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const padding = Math.max(1, (maxW - minW) * 0.1);

  return (
    <div className="h-52 sm:h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            stroke="var(--text)"
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            stroke="var(--text)"
            domain={[minW - padding, maxW + padding]}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={(v) => `${v} kg`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--text-h)",
            }}
            formatter={(value) => [`${value} kg`, "Peso"]}
            labelFormatter={(_, payload) => {
              const iso = payload?.[0]?.payload?.recordedAt;
              if (!iso) return "";
              return new Date(iso).toLocaleString("es-AR", {
                dateStyle: "medium",
                timeStyle: "short",
              });
            }}
          />
          <Line
            type="monotone"
            dataKey="weightKg"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--accent)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
