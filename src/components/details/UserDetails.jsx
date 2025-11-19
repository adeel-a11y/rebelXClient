import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useUser } from "../../hooks/useUsers";
import { useParams } from "react-router-dom";
import { FaCommentDollar } from "react-icons/fa";

const fmtMoney = (n) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
const fmtShortMoney = (n) => `$${n.toLocaleString()}`;

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white shadow-sm border border-slate-100 ${className}`}
  >
    {children}
  </div>
);

const Chip = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${className}`}
  >
    {children}
  </span>
);

const Dot = ({ color = "#10B981" }) => (
  <span
    className="inline-block h-2 w-2 rounded-full"
    style={{ backgroundColor: color }}
  />
);

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-white px-2 py-1 text-xs shadow">
      <div className="font-medium">{label}</div>
      <div>{fmtShortMoney(payload[0].value)}</div>
    </div>
  );
};

const DonutLegend = ({ items }) => (
  <div className="grid grid-cols-3 gap-3 text-sm">
    {items.map((it) => (
      <div key={it.label} className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: it.color }}
        />
        <div className="text-slate-600">{it.label}</div>
        <div className="ml-auto font-medium text-slate-900">{it.value}</div>
      </div>
    ))}
  </div>
);

export default function UserDetails() {
  const { id } = useParams();

  const { data: user, isLoading } = useUser(id);

  const dummyData = {
    user: { name: user?.name || "", avatar: "https://i.pravatar.cc/64?img=8" },
    range: { from: "March 1, 2020", to: "April 31, 2021" },
    accounting: {
      avgMonthlyIncome: 5849.36,
      deltaPct: 3.89,
      deltaRef: "vs $5,432.74 prev. 90 days",
      months: [
        { key: "Nov", value: 3120 },
        { key: "Dec", value: 3580 },
        { key: "Jan", value: 4290 },
        { key: "Feb", value: 4710 },
        { key: "Mar", value: 5320, highlight: true },
        { key: "Apr", value: 3710 },
      ],
      totals: { income: 89240.38, expenses: 16237.82 },
    },
    tasks: {
      new: 3,
      assigned: 16,
      closed: 36,
      onTimeRate: 98,
      onTimeDelta: 2.73,
    },
    properties: {
      occupied: 298,
      vacant: 249,
      maintenance: 85,
      total: 632,
    },
    calendar: {
      today: "Wed",
      date: "23 March",
      week: [
        { d: 21, w: "Mon" },
        { d: 22, w: "Tue" },
        { d: 23, w: "Wed", active: true },
        { d: 24, w: "Thu" },
        { d: 25, w: "Fri" },
        { d: 26, w: "Sat" },
        { d: 27, w: "Sun" },
      ],
      schedule: [
        {
          time: "9:30 am",
          title: "Monthly - Landscaping",
          sub: "Internal Task",
          color: "#19C2C2",
        },
        {
          time: "10:00 am",
          title: "Broken Clamp",
          sub: "Maintenance Request",
          color: "#FF8C1A",
        },
        {
          time: "11:00 am",
          title: "Generate Report",
          sub: "Personal Task",
          color: "#2155FF",
        },
      ],
    },
    activities: [
      {
        type: "new",
        who: "Logan Harrington",
        what: "created new maintenance task",
        when: "Today, 9:48 AM",
      },
      { type: "maintenance", title: "Water Drip from Faucets", id: 284 },
      {
        type: "done",
        who: "Georgia Mollie",
        what: "completed task",
        id: 276,
        when: "Today, 3:58 PM",
      },
    ],
  };

  const d = dummyData;

  const donutData = [
    { name: "Occupied", value: d.properties.occupied, color: "#3B82F6" },
    { name: "Vacant", value: d.properties.vacant, color: "#14B8A6" },
    { name: "Maintenance", value: d.properties.maintenance, color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Top Bar */}
      <div className="mx-auto px-5 py-6">
        <div className="flex items-center gap-3">
          <img
            src={d.user.avatar}
            alt="avatar"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Hi, {d.user.name}
            </h1>
            <p className="text-sm text-slate-500">
              Here's your activity today, take a moment to have look at this.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Accounting Card */}
            <Card>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  {user?.department || "Sales"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {d.range.from} - {d.range.to}
                </p>

                <div className="mt-4 grid gap-5 lg:grid-cols-2">
                  <div className="lg:col-span-2">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500">
                          AVG. Monthly Income
                        </div>
                        <div className="text-3xl font-bold tracking-tight">
                          {fmtShortMoney(d.accounting.avgMonthlyIncome)}
                        </div>
                        <div className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{d.accounting.deltaPct}%</span>
                          <span className="text-slate-400">
                            {d.accounting.deltaRef}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={d.accounting.months}
                          barCategoryGap={20}
                        >
                          <XAxis
                            dataKey="key"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8" }}
                          />
                          <YAxis hide />
                          <Tooltip
                            content={<BarTooltip />}
                            cursor={{ opacity: 0.08 }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {d.accounting.months.map((m, i) => (
                              <Cell
                                key={i}
                                fill={m.highlight ? "#14B8A6" : "#A7F3D0"}
                              />
                            ))}
                            <LabelList
                              dataKey={(x) =>
                                x.highlight ? fmtShortMoney(x.value) : ""
                              }
                              position="top"
                              className="text-[10px] fill-slate-700"
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-700">
                      <CircleDollarSign className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-3xl font-semibold">
                        {fmtMoney(d.accounting.totals.income)}
                      </div>
                      <div className="text-xs text-slate-500">Total Income</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 text-rose-700">
                      <FaCommentDollar className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-3xl font-semibold">
                        {fmtMoney(d.accounting.totals.expenses)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Total Expenses
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bottom Row */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Task Summary */}
              <Card>
                <div className="h-full p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Activities</h3>
                  </div>

                  <div className="">
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-orange-50 p-4">
                        <div className="text-3xl font-bold text-orange-500">
                          {d.tasks.new}
                        </div>
                        <div className="text-sm text-slate-600">Calls</div>
                      </div>
                      <div className="rounded-xl bg-indigo-50 p-4">
                        <div className="text-3xl font-bold text-indigo-600">
                          {d.tasks.assigned}
                        </div>
                        <div className="text-sm text-slate-600">Emails</div>
                      </div>
                      {/* <div className="rounded-xl bg-emerald-50 p-4">
                      <div className="text-3xl font-bold text-emerald-600">
                        {d.tasks.closed}
                      </div>
                      <div className="text-sm text-slate-600">Closed</div>
                    </div> */}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        On-time Completion Rate
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-semibold">
                          {d.tasks.onTimeRate}%
                        </div>
                        <Chip className="border-emerald-200 text-emerald-700">
                          +{d.tasks.onTimeDelta}%
                        </Chip>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Properties & Donut */}
              <Card>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Properties</h3>
                    <button className="text-xs text-emerald-600 hover:underline">
                      All properties →
                    </button>
                  </div>

                  {/* EXACT layout: legend left, donut right, center label */}
                  <div className="mt-4 grid gap-4 grid-cols-1 2xl:grid-cols-2 items-center">
                    {/* LEFT: legend with counts + percentages */}
                    <div className="space-y-3">
                      {donutData.map((x) => {
                        const pct = Math.round(
                          (x.value / d.properties.total) * 100
                        );
                        return (
                          <div key={x.name} className="flex items-start gap-3">
                            <span
                              className="mt-1 h-2.5 w-2.5 rounded-full"
                              style={{ background: x.color }}
                            />
                            <div className="flex-1">
                              <div className="text-slate-900 font-medium leading-none">
                                {x.value}
                              </div>
                              <div className="text-slate-500 text-xs mt-0.5">
                                {x.name} <span className="ml-1">{pct}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* RIGHT: donut with center total */}
                    <div className="relative h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            innerRadius={60}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {donutData.map((s, i) => (
                              <Cell key={i} fill={s.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      {/* center label like the reference */}
                      <div className="pointer-events-none absolute left-1/2 inset-0  -translate-x-1/2 place-content-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold leading-tight text-slate-900">
                            {d.properties.total}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Total Units
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Today</div>
                    <div className="text-lg font-semibold">
                        10 OCTOBER
                    </div>
                  </div>
                </div>

                {/* Week Pills */}
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {d.calendar.week.map((x) => (
                    <div className="">
                      <div
                        key={x.d}
                        className={`rounded-full min-w-[48px] h-[48px] flex flex-col items-center justify-center text-center border ${
                          x.active
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <div className="font-semibold">{x.d}</div>
                      </div>
                      <div className="text-[.8rem] my-1 opacity-80 text-center">{x.w}</div>
                    </div>
                  ))}
                </div>

                {/* Schedule */}
                <div className="mt-4 space-y-3">
                  {d.calendar.schedule.map((e, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[76px_1fr] items-center gap-3"
                    >
                      <div className="text-xs text-slate-500">{e.time}</div>
                      <div
                        className="rounded-xl p-3 text-white"
                        style={{ background: e.color }}
                      >
                        <div className="text-sm font-medium">{e.title}</div>
                        <div className="text-[11px] opacity-90">{e.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Recent Activities</h3>
                  <button className="text-xs text-slate-500">•••</button>
                </div>

                <div className="mt-4 space-y-6">
                  {/* Activity 1 */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600 text-sm">NT</span>
                    </div>
                    <div className="text-sm">
                      <div className="text-slate-700">
                        <span className="font-medium">
                          {d.activities[0].who}
                        </span>{" "}
                        {d.activities[0].what}…
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {d.activities[0].when}
                      </div>
                    </div>
                  </div>

                  {/* Activity 2 */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-700 text-sm">MW</span>
                    </div>
                    <div className="text-sm w-full">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-700">
                          <span className="font-medium">
                            {d.activities[1].title}
                          </span>{" "}
                          <span className="ml-1 text-[10px] rounded bg-slate-100 px-1.5 py-0.5">
                            MAINTENANCE
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          #{d.activities[1].id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity 3 */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-sm">
                      <div className="text-slate-700">
                        <span className="font-medium">
                          {d.activities[2].who}
                        </span>{" "}
                        {d.activities[2].what}{" "}
                        <span className="font-medium">
                          #{d.activities[2].id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {d.activities[2].when}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}