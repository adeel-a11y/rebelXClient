import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { FiPhone, FiFileText, FiMail } from "react-icons/fi";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { useActivitiesByClient } from "../../../hooks/useClients";
import { Link, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useClientOrdersLists } from "../../../hooks/useOrders";

/* ------------------------------------------------------------------
   Fake data for each tab (10 rows each)
-------------------------------------------------------------------*/

// Orders table data
const ORDERS_ROWS = [
  {
    orderNo: "#10234",
    status: "Shipped",
    total: "$540.00",
    date: "9/29/2025",
    rep: "Andy Richardson",
  },
  {
    orderNo: "#10233",
    status: "Processing",
    total: "$210.00",
    date: "9/28/2025",
    rep: "Andy Richardson",
  },
  {
    orderNo: "#10232",
    status: "Delivered",
    total: "$1,120.00",
    date: "9/27/2025",
    rep: "Andy Richardson",
  },
  {
    orderNo: "#10231",
    status: "Delivered",
    total: "$880.00",
    date: "9/25/2025",
    rep: "Victor Junco",
  },
  {
    orderNo: "#10230",
    status: "Cancelled",
    total: "$0.00",
    date: "9/24/2025",
    rep: "Andy Richardson",
  },
  {
    orderNo: "#10229",
    status: "Shipped",
    total: "$640.00",
    date: "9/23/2025",
    rep: "Andy Richardson",
  },
  {
    orderNo: "#10228",
    status: "Processing",
    total: "$330.00",
    date: "9/22/2025",
    rep: "Victor Junco",
  },
  {
    orderNo: "#10227",
    status: "Delivered",
    total: "$150.00",
    date: "9/21/2025",
    rep: "Andy Richardson",
  },
  {
    orderNo: "#10226",
    status: "Delivered",
    total: "$960.00",
    date: "9/21/2025",
    rep: "Andy Richardson",
  },
  {
    orderNo: "#10225",
    status: "Processing",
    total: "$420.00",
    date: "9/20/2025",
    rep: "Victor Junco",
  },
];

// Inventory table data
const INVENTORY_ROWS = [
  {
    sku: "SKU-4392",
    product: "KKP Rush 2G Disposable",
    inStock: 140,
    reserved: 22,
    updatedAt: "9/30/2025",
  },
  {
    sku: "SKU-1120",
    product: "GÜ Berry Blast",
    inStock: 78,
    reserved: 10,
    updatedAt: "9/30/2025",
  },
  {
    sku: "SKU-9981",
    product: "Delta 9 Gummies Mix Pack",
    inStock: 320,
    reserved: 44,
    updatedAt: "9/29/2025",
  },
  {
    sku: "SKU-7710",
    product: "Kratom Capsules Sample Box",
    inStock: 55,
    reserved: 5,
    updatedAt: "9/29/2025",
  },
  {
    sku: "SKU-8802",
    product: "CBD Gummies 25ct Tropical",
    inStock: 210,
    reserved: 20,
    updatedAt: "9/28/2025",
  },
  {
    sku: "SKU-4482",
    product: "CBD Pre-rolls 5pk",
    inStock: 410,
    reserved: 33,
    updatedAt: "9/27/2025",
  },
  {
    sku: "SKU-1444",
    product: "Kava Shot Mango",
    inStock: 98,
    reserved: 12,
    updatedAt: "9/27/2025",
  },
  {
    sku: "SKU-3355",
    product: "2KG G2 Rush Display",
    inStock: 17,
    reserved: 2,
    updatedAt: "9/26/2025",
  },
  {
    sku: "SKU-6691",
    product: "Disposable Sample Kit",
    inStock: 34,
    reserved: 5,
    updatedAt: "9/25/2025",
  },
  {
    sku: "SKU-9001",
    product: "Promo Sticker Pack",
    inStock: 500,
    reserved: 120,
    updatedAt: "9/24/2025",
  },
];

// Sales table data
const SALES_ROWS = [
  {
    invoice: "INV-8821",
    total: "$540.00",
    paidStatus: "Paid",
    date: "9/29/2025",
    rep: "Andy Richardson",
  },
  {
    invoice: "INV-8820",
    total: "$210.00",
    paidStatus: "Paid",
    date: "9/28/2025",
    rep: "Andy Richardson",
  },
  {
    invoice: "INV-8819",
    total: "$1,120.00",
    paidStatus: "Paid",
    date: "9/27/2025",
    rep: "Andy Richardson",
  },
  {
    invoice: "INV-8818",
    total: "$880.00",
    paidStatus: "Paid",
    date: "9/25/2025",
    rep: "Victor Junco",
  },
  {
    invoice: "INV-8817",
    total: "$0.00",
    paidStatus: "Voided",
    date: "9/24/2025",
    rep: "Andy Richardson",
  },
  {
    invoice: "INV-8816",
    total: "$640.00",
    paidStatus: "Paid",
    date: "9/23/2025",
    rep: "Andy Richardson",
  },
  {
    invoice: "INV-8815",
    total: "$330.00",
    paidStatus: "Unpaid",
    date: "9/22/2025",
    rep: "Victor Junco",
  },
  {
    invoice: "INV-8814",
    total: "$150.00",
    paidStatus: "Paid",
    date: "9/21/2025",
    rep: "Andy Richardson",
  },
  {
    invoice: "INV-8813",
    total: "$960.00",
    paidStatus: "Paid",
    date: "9/21/2025",
    rep: "Andy Richardson",
  },
  {
    invoice: "INV-8812",
    total: "$420.00",
    paidStatus: "Paid",
    date: "9/20/2025",
    rep: "Victor Junco",
  },
];

/* ------------------------------------------------------------------
Small reusable row renderers
-------------------------------------------------------------------*/

// Renders the Activities table (looks like your screenshot)
function ActivitiesTable({ rows, loading }) {
  return (
    <CardLike title="Recent Activities" minWidth={`${rows.length === 0 ? 'w-[650px]' : 'w-[950px]'}`}>
      {/* header row */}
      <div className="flex text-[12px] text-gray-500 border-b border-gray-200 py-2 px-4">
        <div className="w-[7%]">Type</div>
        <div className="w-[53%]">
          Description
        </div>
        <div className="w-[15%]">Date</div>
        <div className="w-[15%]">User</div>
        <div className="w-[10%] text-center">Manage</div>
      </div>

      {/* loading */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-500 text-sm gap-3">
          <ClipLoader size={24} color="#4f46e5" />
          <span>Loading activities…</span>
        </div>
      ) : rows.length !== 0 ? (
        // empty state
        <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
          No activities found.
        </div>
      ) : (
        // data rows
        rows.map((r, idx) => (
          <div
            key={idx}
            className="flex items-start border-b last:border-b-0 border-gray-100 py-3 px-4 text-[13px] text-gray-800"
          >
            {/* type icon */}
            <div className="w-[7%] flex items-start">
              {r.type === "Call" ? (
                <FiPhone className="text-green-600 text-[16px]" />
              ) : r.type === "Email" ? (
                <FiMail className="text-red-600 text-[16px]" />
              ) : (
                <FiFileText className="text-blue-600 text-[16px]" />
              )}
            </div>

            {/* desc */}
            <div className="w-[53%] pr-4 text-[13px] leading-[1.4] text-gray-800">
              {r?.description}
            </div>

            {/* date */}
            <div className="w-[15%] text-[13px] text-gray-800">
              {r?.createdAt?.split(" ")[0]}
            </div>

            {/* user */}
            <div className="w-[15%] text-[13px] text-gray-800 truncate">
              {r?.userId}
            </div>

            {/* manage */}
            <div className="w-[10%] flex items-start justify-center gap-3 text-[15px]">
              <button className="text-pink-500 hover:text-pink-600">
                <RiDeleteBinLine />
              </button>
              <Link to={`/activities/${r._id}`} className="text-gray-500 hover:text-gray-700">
                <RiEdit2Line />
              </Link>
            </div>
          </div>
        ))
      )}
    </CardLike>
  );
}

// Orders table
function OrdersTable({ rows }) {
  return (
    <CardLike title="Recent Orders" minWidth={`${rows.length === 0 ? 'w-[650px]' : 'w-[950px]'}`}>
      {/* header row */}
      <div className="flex text-[12px] text-gray-500 border-b border-gray-200 py-2 px-4">
        <div className="w-[100px]">Order #</div>
        <div className="w-[120px]">Date</div>
        <div className="w-[180px]">Sales Rep</div>
        <div className="w-[100px]">Total</div>
        <div className="w-[100px]">Grand Total</div>
        <div className="w-[150px]">Status</div>
        <div className="flex-1 flex items-start justify-end">Manage</div>
      </div>

      {/* rows */}
      {rows.map((r, idx) => (
        <div
          key={idx}
          className="flex items-start border-b last:border-b-0 border-gray-100 py-3 px-4 text-[13px] text-gray-800"
        >
          <div className="w-[100px] font-medium">{r?.Label}</div>
          <div className="w-[120px]">{r?.TimeStamp?.split(" ")[0]}</div>
          <div className="w-[180px] truncate">{r?.SalesRep}</div>
          <div className="w-[100px]">{r?.Total}</div>
          <div className="w-[100px]">{r?.GrandTotal}</div>
          <div className="w-[150px]">
            <span
              className={[
                "inline-block rounded-full px-2 py-1 text-[12px] font-medium border",
                r.OrderStatus === "Completed" || r.OrderStatus === "Delivered" 
                  ? "bg-green-50 text-green-600 border-green-200" :
                r.OrderStatus === "Issued"
                  ? "bg-purple-50 text-purple-600 border-purple-200"
                  : r.OrderStatus === "Shipping"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : r.OrderStatus === "Processing"
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : r.OrderStatus === "Cancelled"
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-gray-50 text-gray-600 border-gray-200",
              ].join(" ")}
            >
              {r?.OrderStatus}
            </span>
          </div>
          <div className="flex-1 flex items-start justify-end gap-3 text-[15px]">
            <button className="text-pink-500 hover:text-pink-600">
              <RiDeleteBinLine />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <RiEdit2Line />
            </button>
          </div>
        </div>
      ))}
    </CardLike>
  );
}

// Inventory table
function InventoryTable({ rows }) {
  return (
    <CardLike title="Latest Inventory" minWidth="min-w-[800px]">
      {/* header */}
      <div className="flex text-[12px] text-gray-500 border-b border-gray-200 py-2 px-4">
        <div className="w-[100px]">SKU</div>
        <div className="flex-1">Product</div>
        <div className="w-[90px] text-right">In Stock</div>
        <div className="w-[90px] text-right">Reserved</div>
        <div className="w-[120px]">Last Updated</div>
        <div className="w-[60px] text-center">Manage</div>
      </div>

      {/* rows */}
      {rows.map((r, idx) => (
        <div
          key={idx}
          className="flex items-start border-b last:border-b-0 border-gray-100 py-3 px-4 text-[13px] text-gray-800"
        >
          <div className="w-[100px] font-medium">{r.sku}</div>
          <div className="flex-1 pr-4">{r.product}</div>
          <div className="w-[90px] text-right font-semibold text-gray-900">
            {r.inStock}
          </div>
          <div className="w-[90px] text-right text-gray-700">{r.reserved}</div>
          <div className="w-[120px]">{r.updatedAt}</div>
          <div className="w-[60px] flex items-start justify-center text-[15px]">
            <button className="text-gray-500 hover:text-gray-700">
              <RiEdit2Line />
            </button>
          </div>
        </div>
      ))}
    </CardLike>
  );
}

// Sales table
function SalesTable({ rows }) {
  return (
    <CardLike title="Recent Sales" minWidth="min-w-[800px]">
      {/* header */}
      <div className="flex text-[12px] text-gray-500 border-b border-gray-200 py-2 px-4">
        <div className="w-[110px]">Invoice #</div>
        <div className="w-[100px]">Total</div>
        <div className="w-[110px]">Payment</div>
        <div className="w-[120px]">Date</div>
        <div className="w-[180px]">Rep</div>
        <div className="w-[250px] text-end">Manage</div>
      </div>

      {/* rows */}
      {rows.map((r, idx) => (
        <div
          key={idx}
          className="flex items-start border-b last:border-b-0 border-gray-100 py-3 px-4 text-[13px] text-gray-800"
        >
          <div className="w-[110px] font-medium">{r.invoice}</div>
          <div className="w-[100px]">{r.total}</div>
          <div className="w-[110px]">
            <span
              className={[
                "inline-block rounded-md px-2 py-1 text-[12px] font-medium border",
                r.paidStatus === "Paid"
                  ? "bg-green-50 text-green-600 border-green-200"
                  : r.paidStatus === "Unpaid"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : r.paidStatus === "Voided"
                      ? "bg-gray-50 text-gray-600 border-gray-200"
                      : "bg-gray-50 text-gray-600 border-gray-200",
              ].join(" ")}
            >
              {r.paidStatus}
            </span>
          </div>
          <div className="w-[120px]">{r.date}</div>
          <div className="w-[180px] truncate">{r.rep}</div>
          <div className="w-[250px] flex items-start justify-end gap-3 text-[15px]">
            <button className="text-pink-500 hover:text-pink-600">
              <RiDeleteBinLine />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <RiEdit2Line />
            </button>
          </div>
        </div>
      ))}
    </CardLike>
  );
}

/* ------------------------------------------------------------------
   Wrapper that makes the "card" look like your screenshot
   (rounded border, title row, etc.)
-------------------------------------------------------------------*/

function CardLike({ title, children, minWidth }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
      {/* Title bar (static, no scroll) */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center text-[14px] font-semibold text-gray-900">
        {title}
      </div>

      {/* Scroll container: sirf yahan horizontal scroll aayega jab zarurat ho */}
      <div className="w-full overflow-x-auto">
        {/* Table content: minimum width 700px */}
        <div className={`${minWidth}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   The Tabs component itself
-------------------------------------------------------------------*/

const TAB_ITEMS = [
  { value: "activities", label: "Activities" },
  { value: "orders", label: "Orders" },
  // { value: "inventory", label: "Inventory" },
  // { value: "sales", label: "Sales" },
];

function SegmentTab({ item, active }) {
  return (
    <div
      className={[
        "flex items-center gap-2 text-[14px] font-semibold leading-none px-4 py-2",
        active
          ? "text-indigo-600"
          : "text-gray-800 group-hover:text-indigo-600",
      ].join(" ")}
    >
      <span>{item.label}</span>
    </div>
  );
}

export default function StatsTabsPanel({ value, setValue }) {

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  const { id, externalId } = useParams();
  const perPage = 50;
  const page = 1;
  const q = "";

  const { data: clientActivities, isLoading, isFetching } = useActivitiesByClient(
    id,
  );

  const { data: clientOrders, isLoading: clientOrdersLoading, isFetching: clientOrdersFetching } = useClientOrdersLists(
    externalId,
  )
  const activities = clientActivities?.data?.slice(0, 10) ?? [];
  const orders = clientOrders?.data?.slice(0, 10) ?? [];

  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={value}>
        {/* pill tab bar */}

        <div className="flex lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full">
            <Box
              className="lg:w-auto inline-flex bg-white my-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-200"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                maxWidth: "100%",
                borderBottom: "none",
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="client tables tabs"
                TabIndicatorProps={{
                  style: { display: "none" },
                }}
                sx={{
                  minHeight: "auto",
                  "& .MuiTabs-flexContainer": {
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    gap: "0.25rem",
                  },
                }}
              >
                {TAB_ITEMS.map((item) => (
                  <Tab
                    key={item.value}
                    value={item.value}
                    disableRipple
                    label={
                      <SegmentTab item={item} active={value === item.value} />
                    }
                    sx={{
                      textTransform: "none",
                      minHeight: "auto",
                      minWidth: "auto",
                      padding: 0,
                      "&.MuiTab-root": {
                        padding: 0,
                      },
                      "& .MuiTab-wrapper": {
                        flexDirection: "row",
                        alignItems: "center",
                      },
                    }}
                    className={[
                      "group",
                      "px-4 py-2 rounded-full transition-all duration-200 ease-out text-sm",
                      value === item.value
                        ? // ACTIVE
                        "bg-indigo-50 ring-1 ring-indigo-100"
                        : // INACTIVE
                        "bg-transparent hover:bg-gray-50",
                    ].join(" ")}
                  />
                ))}
              </TabList>
            </Box>
          </div>

          <div className="w-full text-end lg:pb-0">
            <Link
              to={`${value === 'activities' ? `/client-activities/${activities[0]?.clientId}` : `/client-orders/${activities[0]?.clientId}`}`}
              className="text-indigo-600 hover:text-indigo-700 text-[13px] mt-2"
            >
              View More
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <Box className="p-0">
          <TabPanel value="activities" sx={{ p: 0 }}>
            <ActivitiesTable rows={activities} loading={isLoading || isFetching} />
          </TabPanel>

          <TabPanel value="orders" sx={{ p: 0 }}>
            <OrdersTable rows={orders} />
          </TabPanel>

          <TabPanel value="inventory" sx={{ p: 0 }}>
            <InventoryTable rows={INVENTORY_ROWS} />
          </TabPanel>

          <TabPanel value="sales" sx={{ p: 0 }}>
            <SalesTable rows={SALES_ROWS} />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}