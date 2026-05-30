import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import ChartSkeleton from "../ui/skeletons/ChartSkeleton";

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function toLabel(isoDate) {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "";
    return DAY_LABELS[d.getDay()];
}

export default function WeeklyWorkoutsChart({ data = [], loading = false }) {
    const chartData = (Array.isArray(data) ? data : []).map((point) => ({
        ...point,
        day: toLabel(point.date),
    }));

    return (
        <section
            className="quest-card p-6 pt-7"
            aria-labelledby="weekly-workouts-heading"
        >
            <div className="mb-5">
                <h3
                    id="weekly-workouts-heading"
                    className="text-lg font-semibold text-[var(--text-h)]"
                >
                    Workouts esta semana
                </h3>
                <p className="mt-1 text-sm text-[var(--text)]">
                    Entrenamientos por día (últimos 7 días).
                </p>
            </div>

            {loading ? (
                <ChartSkeleton />
            ) : chartData.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-8 text-center text-sm text-[var(--text)]">
                    Sin datos suficientes para mostrar el gráfico.
                </p>
            ) : (
                <div className="h-56 sm:h-64 lg:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--border)"
                            />
                            <XAxis
                                dataKey="day"
                                stroke="var(--text)"
                                tickLine={false}
                                axisLine={{ stroke: "var(--border)" }}
                            />
                            <YAxis
                                stroke="var(--text)"
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={{ stroke: "var(--border)" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "var(--bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 12,
                                    color: "var(--text-h)",
                                }}
                                labelStyle={{ color: "var(--text-h)" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="workouts"
                                stroke="var(--accent)"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "var(--accent)" }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}
