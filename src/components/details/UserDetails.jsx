import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Icons
import {
  MdCalendarMonth,
  MdCall,
  MdEmail,
  MdMoreHoriz,
  MdOutlineRefresh,
  MdTextsms,
} from "react-icons/md";
import { FaCommentDollar, FaDollarSign } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";

import { useParams } from "react-router-dom";
import moment from "moment";
import { useToolbar } from "../../store/toolbar";
import { useUserActivitiesByMonth, useUserActivitiesRecent, useUserActivitiesSummary } from "../../hooks/useActivities";

// Money formatter
const fmtMoney = (n) =>
  n?.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white shadow-2xl border border-slate-100 ${className}`}
  >
    {children}
  </div>
);

const Chip = ({
  children,
  className = "",
  color = "bg-gray-100 text-gray-800",
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${color} ${className}`}
  >
    {children}
  </span>
);

// Bar tooltip
const CustomBarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="rounded-md bg-white p-3 text-sm shadow-xl border border-gray-200">
      <div className="font-semibold text-gray-800">
        {data.month} {data.year}
      </div>
      <div className="text-gray-600 mt-1">
        Activities:{" "}
        <span className="font-bold text-indigo-600">
          {payload[0].value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// Pie tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-md bg-white p-3 text-sm shadow-lg border border-gray-200 z-[999999]">
        <span className="font-semibold text-slate-800">{data.name}:</span>{" "}
        <span className="font-bold text-indigo-600">
          {data.value} ({data.percentage}%)
        </span>
      </div>
    );
  }
  return null;
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y =
    cy +
    (innerRadius + (outerRadius - innerRadius) * 0.25) *
      Math.sin(-midAngle * RADIAN);

  if (percent * 100 > 5) {
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }
  return null;
};

export default function UserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  // *** REAL HOOK: data + loading
  const { data: userActivitiesByMonth, isLoading: activitiesLoading } =
    useUserActivitiesByMonth(id);
  const { data: userActivitiesSmmary, isLoading: activitiesSummaryLoading } =
    useUserActivitiesSummary(id);
  const { data: userRecentActivities, isLoading: recentActivitiesLoading } =
    useUserActivitiesRecent(id);

  useEffect(() => {
    if (userActivitiesByMonth) {
      setUser(userActivitiesByMonth?.user);
    }
  }, [id, userActivitiesByMonth]);

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const roleBadgeColors = useMemo(
    () => ({
      admin: "bg-rose-100 text-rose-600",
      qc: "bg-purple-100 text-purple-800",
      Sales: "bg-amber-100 text-amber-600",
      sales: "bg-amber-100 text-amber-600",
      "sales-executive": "bg-amber-100 text-amber-600",
      "Sales Director": "bg-amber-100 text-amber-600",
      manager: "bg-indigo-100 text-indigo-600",
      Warehouse: "bg-lime-100 text-lime-600",
      shipping: "bg-blue-100 text-blue-600",
    }),
    []
  );

  const statusBadgeColors = useMemo(
    () => ({
      active: "bg-green-100 text-green-800",
      Inactive: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    }),
    []
  );

  // *** DUMMY DATA BUT DEPENDS ON API RESULT AS WELL
  const dummyData = useMemo(() => {
    const backendMonths = userActivitiesByMonth?.monthlyActivites ?? [];

    // ---------- PROCESS BACKEND MONTHS ----------
    let processedMonths = backendMonths.map((d) => ({
      year: d.year,
      activities: d.activities,
      month: d.month, // e.g. "Jan", "Feb" etc. from backend
    }));

    // ---------- FALLBACK: NO DATA = EMPTY GRAPH WITH 0s ----------
    if (!processedMonths.length) {
      const now = moment();

      // last 12 months generate karo, sab activities = 0
      processedMonths = Array.from({ length: 12 }).map((_, index) => {
        const m = now.clone().subtract(11 - index, "months");
        return {
          year: m.year(),
          month: m.format("MMM"), // "Jan", "Feb", ...
          activities: 0,
        };
      });
    }

    const totalActivities = processedMonths.reduce(
      (sum, d) => sum + (d.activities || 0),
      0
    );
    const avgMonthlyActivities =
      processedMonths.length > 0 ? totalActivities / processedMonths.length : 0;

    const avgMonthlyIncomePlaceholder = 40 * 4 * (user?.hourlyRate ?? 0);
    const totalIncomePlaceholder =
      avgMonthlyIncomePlaceholder * processedMonths.length;
    const totalExpensesPlaceholder = totalIncomePlaceholder * 0.18;

    return {
      range: { from: "Oct 1, 2024", to: "Aug 31, 2025" },
      accounting: {
        avgMonthlyIncome: avgMonthlyActivities,
        deltaPct: 3.89,
        deltaRef: "vs previous 11 months",
        months: processedMonths, // 👈 yahi chart ka data hai
        totals: {
          income: totalIncomePlaceholder,
          expenses: totalExpensesPlaceholder,
        },
      },
      activitySummary: {
        totalActivities: userActivitiesSmmary?.summary?.totalActivities || 0,
        calls: userActivitiesSmmary?.summary?.calls || 0,
        emails: userActivitiesSmmary?.summary?.emails || 0,
        texts: userActivitiesSmmary?.summary?.texts || 0,
        others: userActivitiesSmmary?.summary?.others || 0,
      },
      tasks: {
        onTimeRate: 98,
        onTimeDelta: 2.73,
      },
      calendar: {
        tasksByDate: {
          [moment().format("YYYY-MM-DD")]: [
            {
              time: "9:30 am",
              title: "QC Review: Project Alpha",
              sub: "Priority 1",
              color: "#19C2C2",
            },
            {
              time: "10:00 am",
              title: "Meeting: New Quality Standard",
              sub: "Team Sync",
              color: "#8B5CF6",
            },
            {
              time: "11:00 am",
              title: "Generate QC Audit Report",
              sub: "QC Task",
              color: "#2155FF",
            },
          ],
          [moment().add(1, "day").format("YYYY-MM-DD")]: [
            {
              time: "9:00 am",
              title: "Client Feedback Call",
              sub: "QC/Sales",
              color: "#EC4899",
            },
          ],
        },
      },
      recentActivities: userRecentActivities?.recentActivities,
    };
  }, [user, userActivitiesByMonth, userRecentActivities]); // ✅ dependencies same rahen

  const d = dummyData;

  const activityPieData = useMemo(() => {
    const total = userActivitiesSmmary?.summary?.totalActivities || 0;

    return [
      {
        name: "Calls",
        value: userActivitiesSmmary?.summary?.calls || 0,
        color: "#6366F1",
        percentage: ((userActivitiesSmmary?.summary?.calls / total) * 100).toFixed(1) || 0,
      },
      {
        name: "Emails",
        value: userActivitiesSmmary?.summary?.emails || 0,
        color: "#3B82F6",
        percentage: ((userActivitiesSmmary?.summary?.emails / total) * 100).toFixed(1) || 0,
      },
      {
        name: "Texts",
        value: userActivitiesSmmary?.summary?.texts || 0,
        color: "#EF4444",
        percentage: ((userActivitiesSmmary?.summary?.texts / total) * 100).toFixed(1) || 0,
      },
      {
        name: "Others",
        value: userActivitiesSmmary?.summary?.others || 0,
        color: "#F97316",
        percentage: ((userActivitiesSmmary?.summary?.others / total) * 100).toFixed(1) || 0,
      },
    ];
  }, [userActivitiesSmmary]);

  const weekDates = useMemo(() => {
    const today = moment();
    const startOfWeek = today.clone().startOf("week");
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.clone().add(i, "days"));
    }
    return dates;
  }, []);

  const tasksForSelectedDate = d.calendar.tasksByDate[selectedDate] || [];

  const isLoading = activitiesLoading; // *** ab real loading

  useToolbar({
    title: "User Details",
    searchPlaceholder: "",
    backButton: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-slate-600">
        <MdOutlineRefresh className="animate-spin mr-2 h-6 w-6" /> Loading user
        details...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased pb-10">
      {/* HEADER */}
      <div className="py-8 px-6 text-black">
        <div className="mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-white uppercase font-bold text-3xl flex justify-center items-center w-16 h-16 bg-[#4f46e5] rounded-full ring-2 ring-white ring-opacity-80 shadow-lg">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Hi, {user?.name}!
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Chip
              color={
                roleBadgeColors[user?.role] || "bg-gray-200 text-gray-800"
              }
            >
              <span className="capitalize font-semibold">
                {user?.role || "N/A"}
              </span>
            </Chip>
            <Chip
              color={
                statusBadgeColors[user?.status] || "bg-gray-200 text-gray-800"
              }
            >
              <span className="uppercase font-semibold">
                {user?.status || "N/A"}
              </span>
            </Chip>
          </div>
        </div>
      </div>

      {/* CONTACT CARD */}
      <div className="mx-auto px-6 z-10 relative">
        <Card className="p-4 flex flex-wrap gap-6 text-center lg:text-left justify-around shadow-xl">
          <div className="flex items-center gap-3">
            <MdEmail className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Email</div>
              <div className="text-sm font-semibold text-slate-800">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MdCall className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Phone</div>
              <div className="text-sm font-semibold text-slate-800">
                {user?.phone}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaDollarSign className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="text-xs text-slate-500 font-medium">
                Hourly Rate
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {fmtMoney(user?.hourlyRate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MdCalendarMonth className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="text-xs text-slate-500 font-medium">
                Member Since
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {moment(user?.createdAt).format("MMM D, YYYY")}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mx-auto px-6 py-8">
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* BAR CHART CARD */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Monthly Activities
                </h2>
                <Chip
                  color={
                    roleBadgeColors[user?.department] ||
                    "bg-indigo-100 text-indigo-800"
                  }
                >
                  <span className="capitalize">
                    {user?.department} Department
                  </span>
                </Chip>
              </div>

              <div className="grid gap-5 lg:grid-cols-2 mb-8">
                <div className="lg:col-span-2">
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        AVG. Monthly Activities
                      </div>
                      <div className="text-4xl font-bold tracking-tight text-indigo-700">
                        {userActivitiesByMonth?.average?.toFixed(2) ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={d.accounting.months ?? []} // *** safe
                        barCategoryGap={16}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#64748B",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                          interval={0}
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                          dataKey="activities"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#64748B",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                          domain={[0, "auto"]}
                          tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip
                          content={<CustomBarTooltip />}
                          cursor={{ fill: "#E0E7FF", fillOpacity: 0.6 }}
                        />
                        <Bar
                          dataKey="activities"
                          radius={[8, 8, 0, 0]}
                          fill="#4F46E5"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Income / Expenses */}
              <div className="grid gap-6 mt-8 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-blue-50/60 p-6 shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-700 shadow-lg">
                    <FaDollarSign className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-800">
                      $0
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-0.5">
                      Total Income
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-red-50/60 p-6 shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-red-100 text-red-700 shadow-lg">
                    <FaCommentDollar className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-800">
                      $0
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-0.5">
                      Total Expenses
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* ACTIVITY SUMMARY + PIE CHART */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Activities Indicator
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-yellow-50 p-5 shadow-inner border border-yellow-200">
                    <div className="text-3xl font-semibold text-yellow-700">
                      {d.activitySummary.totalActivities}
                    </div>
                    <div className="text-sm font-medium text-yellow-700 mt-2">
                      Total Activities
                    </div>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-5 shadow-inner border border-emerald-200">
                    <div className="text-3xl font-semibold text-emerald-700">
                      {d.activitySummary.calls}
                    </div>
                    <div className="text-sm font-medium text-emerald-700 mt-2">
                      Calls
                    </div>
                  </div>
                  <div className="rounded-xl bg-red-50 p-5 shadow-inner border border-red-200">
                    <div className="text-3xl font-semibold text-red-700">
                      {d.activitySummary.emails}
                    </div>
                    <div className="text-sm font-medium text-red-700 mt-2">
                      Emails
                    </div>
                  </div>
                  <div className="rounded-xl bg-sky-50 p-5 shadow-inner border border-sky-200">
                    <div className="text-3xl font-semibold text-sky-700">
                      {d.activitySummary.texts}
                    </div>
                    <div className="text-sm font-medium text-sky-700 mt-2">
                      Texts
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Activity Distribution
                </h3>
                <div className="flex flex-col items-center">
                  <div className="relative h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activityPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={75}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          labelLine={false}
                          label={PieLabel}
                        >
                          {activityPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-2xl font-extrabold text-slate-800">
                          {d.activitySummary.totalActivities}
                        </div>
                        <div className="text-sm text-slate-500 font-medium mt-1">
                          Total Activities
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4 w-full px-4">
                    {activityPieData.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span
                          className="h-3 w-3 rounded-full shadow-md"
                          style={{ backgroundColor: entry.color }}
                        ></span>
                        <div className="text-slate-700 font-medium">
                          {entry.name}
                        </div>
                        <div className="ml-auto text-slate-900 font-semibold">
                          {entry.value} ({entry.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            {/* SCHEDULE CARD */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500 font-medium">
                    Schedule
                  </div>
                  <div className="text-xl font-bold text-slate-800">
                    {moment().format("DD MMMM").toUpperCase()}
                  </div>
                </div>
                <MdCalendarMonth className="h-7 w-7 text-[#4f46e5]" />
              </div>

              <div className="mt-5 grid grid-cols-7 gap-2 pb-1">
                {weekDates.map((dateObj) => {
                  const dateString = dateObj.format("YYYY-MM-DD");
                  const isActive = dateString === selectedDate;
                  const hasTasks =
                    d.calendar.tasksByDate[dateString]?.length > 0;
                  return (
                    <button
                      key={dateString}
                      onClick={() => setSelectedDate(dateString)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-200
                                  ${
                                    isActive
                                      ? "bg-gradient-to-br from-[#4f46e5] to-[#4f46e5] text-white shadow-xl"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                                  }`}
                    >
                      <div className="text-xs opacity-80">
                        {dateObj.format("ddd")}
                      </div>
                      <div className="text-lg font-semibold">
                        {dateObj.format("D")}
                      </div>
                      {hasTasks && !isActive && (
                        <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-inner"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-4">
                {tasksForSelectedDate.length > 0 ? (
                  <ol className="list-none space-y-4">
                    {tasksForSelectedDate.map((e, i) => (
                      <li
                        key={i}
                        className="relative border-[1px] rounded-xl p-4 text-[#4f46e5] group transform transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: "#fff" }}
                      >
                        <div className="text-sm font-bold">{e.title}</div>
                        <div className="text-xs opacity-90">{e.sub}</div>
                        <div className="absolute top-2 right-2 text-xs opacity-80 font-semibold group-hover:opacity-100 transition-opacity duration-200">
                          {e.time}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="p-6 text-center text-slate-500 bg-slate-100 rounded-xl shadow-inner">
                    <p className="font-medium">
                      No high-priority tasks for{" "}
                      {moment(selectedDate).format("MMMM D, YYYY")}.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* RECENT ACTIVITIES */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  Recent Activities
                </h3>
                <button className="text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  <MdMoreHoriz className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-5 space-y-6">
                {d?.recentActivities?.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-md ${activity.type === "Call" ? "bg-emerald-50" : activity.type === "Email" ? "bg-rose-50" : "bg-blue-50"}`}
                    >
                      {
                        activity.type === "Call" ? (
                          <MdCall className="text-emerald-500" />
                        ) : activity.type === "Email" ? (
                          <MdEmail className="text-rose-500" />
                        ) : (
                          <MdTextsms className="text-blue-500" />
                        )
                      }
                    </div>
                    <div className="text-sm flex-1">
                      <div className="text-slate-800 font-medium leading-tight">
                        {activity.description && (
                          <span className="font-normal text-black">
                            {activity.description}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {activity.createdAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
