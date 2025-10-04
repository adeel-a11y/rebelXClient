// src/pages/Dashboard.jsx
import React from "react";
import dayjs from "dayjs";
import { useToolbar } from "../store/toolbar";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

/* ---------- Helpers & small components ---------- */
const COLORS = [
  "#1f44d5",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#e11d48",
];
const number = (n) => (typeof n === "number" ? n.toLocaleString() : n ?? "0");

function KPI({ title, value, sub, accent = "#1f44d5" }) {
  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 0.3 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ---------- Demo DATA (generated from your CSVs in this session) ---------- */
const DATA = {
  kpis: {
    totalClients: 1679,
    withCard: 252,
    totalForecasted: 521375.23,
    new30: 36,
    new90: 116,
    emailCoverage: 72.13,
    phoneCoverage: 74.09,
    activitiesTotal: 17,
    activities30: 0,
  },
  trendMonthlyNew: [
    { month: "2024-11", newClients: 34 },
    { month: "2024-12", newClients: 67 },
    { month: "2025-01", newClients: 55 },
    { month: "2025-02", newClients: 55 },
    { month: "2025-03", newClients: 58 },
    { month: "2025-04", newClients: 60 },
    { month: "2025-05", newClients: 59 },
    { month: "2025-06", newClients: 56 },
    { month: "2025-07", newClients: 65 },
    { month: "2025-08", newClients: 64 },
    { month: "2025-09", newClients: 70 },
    { month: "2025-10", newClients: 36 },
  ],
  breakdowns: {
    "Contact Type": [
      { name: "Retail", value: 806 },
      { name: "Distributor", value: 357 },
      { name: "Individual", value: 217 },
      { name: "Uncategorized", value: 96 },
      { name: "Wholesaler", value: 73 },
      { name: "Online", value: 59 },
    ],
    "Company Type": [
      { name: "Smoke Shop", value: 775 },
      { name: "Unspecified", value: 684 },
      { name: "Grocery", value: 43 },
      { name: "Gas Station", value: 41 },
      { name: "Vape Shop", value: 24 },
      { name: "CBD Shop", value: 22 },
      { name: "Head Shop", value: 17 },
      { name: "Convenience Store", value: 16 },
    ],
    "Contact Status": [
      { name: "Unspecified", value: 1205 },
      { name: "New", value: 402 },
      { name: "Contacted", value: 50 },
      { name: "Qualified", value: 15 },
      { name: "Customer", value: 5 },
      { name: "In Progress", value: 2 },
    ],
  },
  activityDaily: [], // none recent in CSV; chart falls back to placeholder
  activityTypes: [
    { name: "Call", value: 9 },
    { name: "Email", value: 5 },
    { name: "Meeting", value: 3 },
  ],
  activityUsers: [
    { name: "alecia@grassrootsharvest.com", value: 11 },
    { name: "andy@rebelxbrands.com", value: 5 },
    { name: "adeel@grassrootsharvest.com", value: 1 },
  ],
};

/* ---------- Page ---------- */
export default function Dashboard() {
  useToolbar({ title: "Dashboard", searchPlaceholder: "Quick search…" });

  const k = DATA.kpis;

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {/* KPI row */}
        <div className=" card">
          <KPI
            title="Total Clients"
            value={number(k.totalClients)}
            sub={`${number(k.new30)} new in 30d`}
          />
        </div>
        <div className=" card">
          <KPI
            title="With Card on File"
            value={number(k.withCard)}
            sub={`${Math.round(
              (k.withCard / k.totalClients) * 100
            )}% of clients`}
            accent="#10b981"
          />
        </div>
        <div className=" card">
          <KPI
            title="Forecasted Pipeline"
            value={`$${number(Math.round(k.totalForecasted))}`}
            sub={`90d adds: ${number(k.new90)}`}
            accent="#f59e0b"
          />
        </div>
        <div
          className=" card"
          style={{ display: "grid", placeItems: "center" }}
        >
          <ResponsiveContainer width="100%" height={120}>
            <RadialBarChart
              innerRadius="60%"
              outerRadius="100%"
              data={[
                { name: "Email", value: k.emailCoverage, fill: "#0ea5e9" },
                { name: "Phone", value: k.phoneCoverage, fill: "#10b981" },
              ]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={6} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 12, color: "#64748b" }}>Data Coverage</div>
        </div>
      </div>

      {/* Trend */}
      <div className="col-8 my-4 card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          New Clients by Month
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={DATA.trendMonthlyNew}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f44d5" stopOpacity={0.35} />
                <stop offset="90%" stopColor="#1f44d5" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(v) => dayjs(v + "-01").format("MMM YYYY")}
            />
            <Area
              type="monotone"
              dataKey="newClients"
              stroke="#1f44d5"
              strokeWidth={2}
              fill="url(#g1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity users */}
      <div className="col-4 card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          Top Activity Users
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={DATA.activityUsers}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-20}
              height={70}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donuts */}
      {Object.entries(DATA.breakdowns).map(([title, arr]) => (
        <div className="col-4 card" key={title}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={arr}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={88}
                paddingAngle={2}
              >
                {arr.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: 12 }}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}

      {/* Activity timeline */}
      <div className="col-12 card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>Activities Timeline</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Last 30 entries • Total: {k.activitiesTotal} • 30d: {k.activities30}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={
              DATA.activityDaily?.length
                ? DATA.activityDaily
                : [{ day: "No recent", count: 0 }]
            }
          >
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
