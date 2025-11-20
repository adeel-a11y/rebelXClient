// src/pages/Dashboard.jsx (Updated Luxe Version)
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
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
} from "recharts";
import { getCompanyTypeBreakdown, getContactStatusBreakdown, getContactTypeBreakdown, getTopUsersByActivity, monthlyNewClients, overviewAnalytics } from "../api/analytics";
import { useLocation } from "react-router-dom";
import { useToolbar } from "../store/toolbar";

/* ---------- Theme & helpers ---------- */
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
function number(n) {
  try {
    return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(
      Number(n || 0)
    );
  } catch (e) {
    return n;
  }
}

/* =========================================================
   KPI Card (kept API-compatible with your previous version)
   ========================================================= */
function KPI({ title, value, sub, accent = "#1f44d5" }) {
  return (
    <div className="group relative">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 10%, var(--accent)/.35, transparent 70%),\nradial-gradient(60% 50% at 70% 90%, var(--accent)/.2, transparent 70%)",
          "--accent": accent,
        }}
      />

      {/* Gradient border wrapper */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-sky-500/60 via-fuchsia-500/60 to-amber-400/60 dark:from-sky-500/40 dark:via-fuchsia-500/40 dark:to-amber-400/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,.2)]">
        <div className="rounded-2xl bg-white/90 dark:bg-slate-950/70 backdrop-blur-md p-5 md:p-6 flex flex-col gap-2.5 h-full">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ background: accent }}
            />
            <span className="text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
              {title}
            </span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="text-[28px] leading-none font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {value || 0}
            </div>
            <div
              className="shrink-0 rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border"
              style={{
                color: accent,
                borderColor: `${accent}55`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.6))",
              }}
            >
              KPI
            </div>
          </div>

          {sub && (
            <div
              className="pt-1 text-[12px] font-semibold"
              style={{ color: accent }}
            >
              {sub || 0}
            </div>
          )}

          <div className="mt-1 h-px w-0 bg-gradient-to-r from-transparent via-[var(--tw-accent)] to-transparent transition-all duration-500 group-hover:w-full" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Pretty chart wrappers (Recharts + Tailwind)
   ========================================================= */
function ChartCard({ title, subtitle, right, children, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background:
            "radial-gradient(50% 40% at 30% 0%, #60a5fa33, transparent 70%), radial-gradient(50% 50% at 80% 100%, #f472b633, transparent 70%), radial-gradient(50% 50% at 10% 80%, #f59e0b33, transparent 70%)",
        }}
      />
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-sky-500/50 via-fuchsia-500/50 to-amber-400/50 shadow-[0_10px_30px_-10px_rgba(0,0,0,.20)]">
        <div className="rounded-2xl bg-white/90 dark:bg-slate-950/70 backdrop-blur-xl p-4 md:p-5">
          <div className="flex flex-col gap-3 items-start justify-between">
            <div>
              {title && (
                <div className="text-sm md:text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
              )}
            </div>
            {right}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function NiceTooltip({ active, payload, label, labelFmt }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg ring-1 ring-black/5 p-3 min-w-40">
      <div className="text-[12px] font-bold text-sky-600 mb-1">
        {labelFmt ? labelFmt(label) : label}
      </div>
      <div className="space-y-1.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px]">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ background: p.color }}
            />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {p.name}
            </span>
            <span className="ml-auto font-bold">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendPills({ items }) {
  return (
    <div className="flex flex-wrap gap-2 text-[11px]">
      {items.map((it, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-1 rounded-full border px-2 py-1"
          style={{ borderColor: `${it.color}55` }}
        >
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ background: it.color }}
          />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Specific chart components */
function TrendArea() {
  const [newClients, setNewClients] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const response = await monthlyNewClients();
        setNewClients(response.data || []);
      } finally {
        setLoaded(true);
      }
    })();
  }, [location.pathname]);

  return (
    <ChartCard title="New Clients by Month">
      <div className="h-[240px]">
        {!loaded ? (
          // skeleton / loader
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            Loading trend…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={newClients}
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              // key forces a fresh mount when data appears the first time
              key={newClients.length}
            >
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.38} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickMargin={8}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={
                  <NiceTooltip
                    labelFmt={(v) => dayjs(v + "-01").format("MMM YYYY")}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="newClients"
                stroke="#6366f1"
                fill="url(#trendFill)"
                isAnimationActive={true}
                animationBegin={300}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}


function TopUsersBar() {

  const [activityUsers, setActivityUsers] = useState([]);

  const topUsers = async () => {
    try {
      const response = await getTopUsersByActivity();
      console.log("activity Users", response.data);
      setActivityUsers(response.data);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    topUsers();
  }, []);

  return (
    <ChartCard title="Top Activity Users">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityUsers}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#64748b" }}
              interval={0}
              angle={-20}
              height={70}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<NiceTooltip />} />
            <Bar dataKey="activityCount" radius={[8, 8, 0, 0]} fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

function Donut({ title, data, colors }) {
  const palette = colors || COLORS;
  const total = data.reduce((a, b) => a + (b.value || 0), 0);

  return (
    <ChartCard
      title={title}
      right={
        <LegendPills
          items={data.map((d, i) => ({
            label: d.name,
            color: palette[i % palette.length],
          }))}
        />
      }
    >
      <div className="h-[260px] place-content-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Pie>
            <Tooltip content={<NiceTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Total
            </div>
            <div className="text-xl font-extrabold">
              {total.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}


/* ---------- Page ---------- */
export default function Dashboard() {

  const [contactStatusBreakdown, setContactStatusBreakdown] = useState([]);
  const [companyTypeBreakdown, setCompanyTypeBreakdown] = useState([]);
  const [contactTypeBreakdown, setContactTypeBreakdown] = useState([]);

  // Contact Status
  useEffect(() => {
    (async () => {
      const response = await getContactStatusBreakdown();
      console.log("contact Status", response.data);
      setContactStatusBreakdown(response?.data);
    })();
  }, []);

  // Company Type
  useEffect(() => {
    (async () => {
      const response = await getCompanyTypeBreakdown();
      console.log("company Type", response.data);
      setCompanyTypeBreakdown(response?.data);
    })();
  }, []);

  // Contact Type
  useEffect(() => {
    (async () => {
      const response = await getContactTypeBreakdown();
      console.log("contact Type", response.data);
      setContactTypeBreakdown(response?.data);
    })();
  }, []);


  /* ---------- Demo DATA (same as your version) ---------- */
  const DATA = {
    breakdowns: {
      "Contact Type": contactTypeBreakdown,
      "Company Type": companyTypeBreakdown?.slice(0, 8),
      "Contact Status": contactStatusBreakdown,
    },
  };

  useToolbar({
    title: "Dashboard",
    search: null,
    actions: [],
    backButton: true,  
  });

  const [overview, setOverview] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await overviewAnalytics();
      setOverview(response?.data);
    })();
  }, []);


  return (
    <>
      <div className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 md:py-2">
        <h1 className="text-2xl md:text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 mb-5">
          Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
          <KPI
            title="Total Clients"
            value={number(overview?.totals?.totalClients)}
            sub={`${number(overview?.thisMonth?.monthlyClients)} new in 30d`}
            accent="#1f44d5"
          />
          <KPI
            title="Total Users"
            value={number(overview?.totals?.totalUsers)}
            sub={`${Math.round(overview?.thisMonth?.monthlyUsers)} new in 30d`}
            accent="#10b981"
          />
          <KPI
            title="Total Activities"
            value={number(overview?.totals?.totalActivities)}
            sub={`${number(overview?.thisMonth?.monthlyActivities)} new in 30d`}
            accent="#f59e0b"
          />
          <KPI
            title="Active Users"
            value={number(overview?.totals?.activeUsers)}
            sub={`${number(
              overview?.thisMonth?.monthlyActiveUsers
            )} new in 30 days`}
            accent="#8b5cf6"
          />
        </div>
      </div>

      {/* Trend + Top Users */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 my-4">
        <TrendArea />
        <TopUsersBar />
      </div>

      {/* Donuts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {Object.entries(DATA.breakdowns).map(([title, arr]) => (
          <Donut key={title} title={title} data={arr} colors={COLORS} />
        ))}
      </div>

      {/* Activity timeline */}
      <div className="my-4"></div>
    </>
  );
}
