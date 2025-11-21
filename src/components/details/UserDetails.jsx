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
// Importing all necessary icons from React Icons
import {
  MdCalendarMonth,
  MdCheckCircle,
  MdCall,
  MdEmail,
  MdForum,
  MdMoreHoriz,
  MdTrendingUp,
  MdOutlineRefresh,
  MdTrackChanges,
  MdTextFields,
} from "react-icons/md";
import { FaCommentDollar, FaTasks, FaDollarSign } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";

import { useParams } from "react-router-dom"; // Assuming useUser is commented out/removed for static data
import moment from "moment";
import { useToolbar } from "../../store/toolbar";

// --- USER AND ACTIVITIES DATA (Integrated from your input) ---
const userData = {
  _id: "691d96e776f978a44c11a9c8",
  name: "Ahsan",
  email: "ahsan666@gmail.com",
  role: "qc",
  department: "qc",
  phone: "03162196345",
  hourlyRate: 19.0, // Converted to number for calculation
  status: "inactive",
  createdAt: "2025-11-19T10:07:35.758Z",
  updatedAt: "2025-11-19T10:43:46.557Z",
};

const monthlyActivitiesData = [
  { monthYear: "October 2024", activities: 1159 },
  { monthYear: "November 2024", activities: 1421 },
  { monthYear: "December 2024", activities: 1510 },
  { monthYear: "January 2025", activities: 1819 },
  { monthYear: "February 2025", activities: 1527 },
  { monthYear: "March 2025", activities: 1537 },
  { monthYear: "April 2025", activities: 1587 },
  { monthYear: "May 2025", activities: 1360 },
  { monthYear: "June 2025", activities: 853 },
  { monthYear: "July 2025", activities: 1233 },
  { monthYear: "August 2025", activities: 765 },
];

// Helper functions for formatting money
const fmtMoney = (n) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
const fmtShortMoney = (n) => `$${n.toLocaleString()}`;

// Reusable Card component - Increased shadow for better look
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white shadow-2xl border border-slate-100 ${className}`} // shadow-2xl for premium look
  >
    {children}
  </div>
);

// Reusable Chip component
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

// Custom BarChart Tooltip
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  // Format monthYear from "January 2025"
  const [month, year] = data.monthYear.split(" ");
  return (
    <div className="rounded-md bg-white p-3 text-sm shadow-xl border border-gray-200">
      <div className="font-semibold text-gray-800">
        {month} {year}
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

// ... (Other helper components like CustomPieTooltip, PieLabel remain the same) ...

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

const PieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  percent,
  index,
  name,
}) => {
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
  // Use static data instead of hook
  const user = userData;
  const isLoading = false; // Set to false since data is local
  // const { id } = useParams(); // Not needed for static user

  // State for selected date in calendar
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // Define badge colors for roles and statuses
  const roleBadgeColors = useMemo(
    () => ({
      admin: "bg-purple-100 text-purple-800",
      qc: "bg-emerald-100 text-emerald-800", // Highlighted for Ahsan's role
      sales: "bg-blue-100 text-blue-800",
      manager: "bg-red-100 text-red-800",
    }),
    []
  );

  const statusBadgeColors = useMemo(
    () => ({
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800", // Highlighted for Ahsan's status
      pending: "bg-yellow-100 text-yellow-800",
    }),
    []
  );

  // --- DUMMY DATA (Updated with Ahsan's actual info and activity data) ---
  const dummyData = useMemo(() => {
    // Process the monthly data for the chart
    const processedMonths = monthlyActivitiesData.map((d) => ({
      monthYear: d.monthYear,
      activities: d.activities,
      // For Recharts XAxis, we need a simple key (like month)
      month: d.monthYear.substring(0, 3),
    }));

    const totalActivities = processedMonths.reduce(
      (sum, d) => sum + d.activities,
      0
    );
    const avgMonthlyActivities = totalActivities / processedMonths.length;

    // Placeholder calculation for Income based on hourly rate (40h/week * 4 weeks/month * hourlyRate)
    const avgMonthlyIncomePlaceholder = 40 * 4 * user.hourlyRate;
    const totalIncomePlaceholder =
      avgMonthlyIncomePlaceholder * processedMonths.length;
    const totalExpensesPlaceholder = totalIncomePlaceholder * 0.18; // 18% as dummy expense

    return {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`,
        role: user.role,
        department: user.department,
        status: user.status,
      },
      range: { from: "Oct 1, 2024", to: "Aug 31, 2025" }, // Based on new data
      accounting: {
        avgMonthlyIncome: avgMonthlyActivities, // Use activities as the main metric here
        deltaPct: 3.89, // Placeholder
        deltaRef: "vs previous 11 months", // Placeholder
        months: processedMonths,
        totals: {
          income: totalIncomePlaceholder,
          expenses: totalExpensesPlaceholder,
        },
      },
      // Keep activity summary data as placeholder but update total
      activitySummary: {
        totalActivities: 289, // New total for the Activities/Emails block
        calls: 89,
        emails: 200,
        texts: 100,
        others: 50,
      },
      tasks: {
        // Placeholder for on-time completion
        onTimeRate: 98,
        onTimeDelta: 2.73,
      },
      calendar: {
        // Use current data structure for calendar
        tasksByDate: {
          [moment().format("YYYY-MM-DD")]: [
            // Today's tasks
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
            // Tomorrow's tasks
            {
              time: "9:00 am",
              title: "Client Feedback Call",
              sub: "QC/Sales",
              color: "#EC4899",
            },
          ],
        },
      },
      recentActivities: [
        {
          type: "email",
          who: "QC Team Lead",
          what: "sent an email regarding new audit checklist",
          when: "Today, 9:48 AM",
          icon: <MdEmail className="h-4 w-4 text-red-600" />,
          iconBg: "bg-red-100",
          iconText: "text-red-600",
        },
        {
          type: "done",
          who: "Ahsan",
          what: "completed task",
          id: 452,
          when: "2 days ago, 3:58 PM",
          icon: <TiDocumentText className="h-4 w-4 text-sky-600" />,
          iconBg: "bg-sky-100",
          iconText: "text-sky-600",
        },
        {
          type: "call",
          who: "Ahsan",
          what: "made a QC follow-up call to",
          target: "Client Beta",
          when: "3 days ago, 1:00 PM",
          icon: <MdCall className="h-4 w-4 text-green-600" />,
          iconBg: "bg-green-100",
          iconText: "text-green-600",
        },
      ],
    };
  }, [user]);

  const d = dummyData;

  // Pie chart data for activity types
  const activityPieData = useMemo(() => {
    const total =
      d.activitySummary.calls +
      d.activitySummary.emails +
      d.activitySummary.texts +
      d.activitySummary.others;
    return [
      {
        name: "Calls",
        value: d.activitySummary.calls,
        color: "#6366F1",
        percentage: ((d.activitySummary.calls / total) * 100).toFixed(1),
      },
      {
        name: "Emails",
        value: d.activitySummary.emails,
        color: "#3B82F6",
        percentage: ((d.activitySummary.emails / total) * 100).toFixed(1),
      },
      {
        name: "Texts",
        value: d.activitySummary.texts,
        color: "#EF4444",
        percentage: ((d.activitySummary.texts / total) * 100).toFixed(1),
      },
      {
        name: "Others",
        value: d.activitySummary.others,
        color: "#F97316",
        percentage: ((d.activitySummary.others / total) * 100).toFixed(1),
      },
    ];
  }, [d.activitySummary]);

  // Calendar helpers remain the same
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-slate-600">
        <MdOutlineRefresh className="animate-spin mr-2 h-6 w-6" /> Loading user
        details...
      </div>
    );
  }

  useToolbar({
    title: "User Details",
    searchPlaceholder: "",
    backButton: true,
  });

  // --- UI RENDERING ---
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased pb-10">
      {/* HEADER SECTION - Dark Blue Gradient, aligned with image_2d7b58.png */}
      <div className="py-8 px-6 text-black">
        <div className="mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-white font-bold text-3xl flex justify-center items-center w-16 h-16 bg-[#4f46e5] rounded-full ring-2 ring-white ring-opacity-80 shadow-lg">
              AH
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Hi, {d.user.name}!
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Your personalized quality control overview.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Chip
              color={
                roleBadgeColors[d.user.role] || "bg-gray-200 text-gray-800"
              }
            >
              <span className="capitalize font-semibold">
                {d.user.role || "N/A"}
              </span>
            </Chip>
            <Chip
              color={
                statusBadgeColors[d.user.status] || "bg-gray-200 text-gray-800"
              }
            >
              <span className="uppercase font-semibold">
                {d.user.status || "N/A"}
              </span>
            </Chip>
          </div>
        </div>
      </div>

      {/* CONTACT INFO CARD - New card for Ahsan's contact/rate details */}
      <div className="mx-auto px-6 z-10 relative">
        <Card className="p-4 flex flex-wrap gap-6 text-center lg:text-left justify-around shadow-xl">
          <div className="flex items-center gap-3">
            <MdEmail className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Email</div>
              <div className="text-sm font-semibold text-slate-800">
                {d.user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MdCall className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Phone</div>
              <div className="text-sm font-semibold text-slate-800">
                {d.user.phone}
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
                {fmtMoney(user.hourlyRate)}
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
                {moment(user.createdAt).format("MMM D, YYYY")}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mx-auto px-6 py-8">
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* ACTIVITY BAR CHART CARD */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Monthly Activities
                </h2>
                <Chip
                  color={
                    roleBadgeColors[user.department] ||
                    "bg-indigo-100 text-indigo-800"
                  }
                >
                  <span className="capitalize">
                    {user.department} Department
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
                        {d.accounting.avgMonthlyIncome
                          .toFixed(0)
                          .toLocaleString()}
                      </div>
                      <div className="mt-2 text-sm text-emerald-600 flex items-center gap-1 font-medium">
                        <MdTrendingUp className="h-4 w-4" />
                        <span>{d.accounting.deltaPct}%</span>
                        <span className="text-slate-400 ml-1">
                          {d.accounting.deltaRef}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={d.accounting.months}
                        barCategoryGap={16}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="month" // Using the short month name
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

              {/* DUMMY INCOME/EXPENSES BASED ON HOURLY RATE */}
              <div className="grid gap-6 mt-8 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-blue-50/60 p-6 shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-700 shadow-lg">
                    <FaDollarSign className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-800">
                      {fmtMoney(d.accounting.totals.income)}
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-0.5">
                      Placeholder Total Income
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-red-50/60 p-6 shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-red-100 text-red-700 shadow-lg">
                    <FaCommentDollar className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-800">
                      {fmtMoney(d.accounting.totals.expenses)}
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-0.5">
                      Placeholder Total Expenses
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* ACTIVITY SUMMARY & PIE CHART GRID */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Activities Indicator
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Activities */}
                  <div className="rounded-xl bg-purple-50 p-5 shadow-inner border border-purple-200">
                    <div className="text-3xl font-semibold text-purple-700">
                      {d.activitySummary.totalActivities}
                    </div>
                    <div className="text-sm font-medium text-slate-600 mt-2">
                      Total Activities
                    </div>
                  </div>
                  {/* Calls */}
                  <div className="rounded-xl bg-indigo-50 p-5 shadow-inner border border-indigo-200">
                    <div className="text-3xl font-semibold text-indigo-700">
                      {d.activitySummary.calls}
                    </div>
                    <div className="text-sm font-medium text-slate-600 mt-2">
                      Calls
                    </div>
                  </div>
                  {/* Emails */}
                  <div className="rounded-xl bg-blue-50 p-5 shadow-inner border border-blue-200">
                    <div className="text-3xl font-semibold text-blue-700">
                      {d.activitySummary.emails}
                    </div>
                    <div className="text-sm font-medium text-slate-600 mt-2">
                      Emails
                    </div>
                  </div>
                  {/* Texts */}
                  <div className="rounded-xl bg-green-50 p-5 shadow-inner border border-green-200">
                    <div className="text-3xl font-semibold text-green-700">
                      {d.activitySummary.texts}
                    </div>
                    <div className="text-sm font-medium text-slate-600 mt-2">
                      Texts
                    </div>
                  </div>
                </div>
              </Card>

              {/* ACTIVITY DISTRIBUTION PIE CHART */}
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
                          innerRadius={70}
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
                    {/* Center label for total */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-4xl font-extrabold text-slate-800">
                          {d.activitySummary.totalActivities}
                        </div>
                        <div className="text-sm text-slate-500 font-medium mt-1">
                          Total Activities
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
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
            {/* CALENDAR & TASKS CARD */}
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

              {/* Week Pills - Interactive for task selection */}
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

              {/* Schedule / Tasks for selected date */}
              <div className="mt-6 space-y-4">
                {tasksForSelectedDate.length > 0 ? (
                  <ol className="list-none space-y-4">
                    {tasksForSelectedDate.map((e, i) => (
                      <li
                        key={i}
                        className="relative border-[1px] rounded-xl p-4 text-[#4f46e5] group transform transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: "#fff" }} // Use main color
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

            {/* RECENT ACTIVITIES CARD */}
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
                {d.recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-md ${activity.iconBg}`}
                    >
                      {activity.icon ? (
                        activity.icon
                      ) : (
                        <span
                          className={`text-sm font-semibold ${activity.iconText}`}
                        >
                          {activity.initials}
                        </span>
                      )}
                    </div>
                    <div className="text-sm flex-1">
                      <div className="text-slate-800 font-medium leading-tight">
                        {activity.who && (
                          <span className="font-bold text-indigo-600">
                            {activity.who}
                          </span>
                        )}{" "}
                        {activity.what}{" "}
                        {activity.target && (
                          <span className="font-bold text-blue-600">
                            {activity.target}
                          </span>
                        )}
                        {activity.title && (
                          <span className="font-bold text-indigo-600">
                            {activity.title}
                          </span>
                        )}
                        {activity.id && (
                          <span className="ml-2 text-xs text-slate-400 font-semibold">
                            #{activity.id}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {activity.when}
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
