import React, { useEffect, useState } from "react";
import {
  FiMail,
  FiEdit2,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTag,
  FiHash,
  FiUser,
  FiDatabase,
  FiDollarSign,
  FiPhone,
  FiPlus,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import trackImg from "/track.png";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteOrderItem } from "../../../hooks/useOrders";
import ToastNotification from "../../ToastNotification";

/* ---------------- helpers ---------------- */
const toNumber = (v) => {
  if (v === undefined || v === null || v === "") return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmtMoney = (v) => `$${toNumber(v).toFixed(2)}`;
const fmtDate = (d) => {
  if (!d) return "";
  const t = new Date(d);
  return isNaN(t.getTime()) ? String(d) : t.toLocaleString();
};

/* --------------- tiny UI atoms --------------- */
const THEME = { border: "#E5E7EB", bg: "#F7F8FC" };
const Page = ({ children }) => (
  <div className="min-h-screen" style={{ backgroundColor: THEME.bg }}>
    <div className="mx-auto w-full mb-6">{children}</div>
  </div>
);
const Card = ({ className = "", children }) => (
  <div
    className={`rounded-2xl bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ${className}`}
    style={{ borderColor: THEME.border }}
  >
    {children}
  </div>
);
const SectionHeader = ({ title, right }) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    {right}
  </div>
);
const IconDot = ({ children, className = "bg-slate-100 text-slate-600" }) => (
  <span
    className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${className}`}
  >
    {children}
  </span>
);
const Chip = ({ children, tone = "success" }) => {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    info: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
    gray: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${
        tones[tone] || tones.gray
      }`}
    >
      {children}
    </span>
  );
};
const K = ({
  label,
  value,
  icon,
  iconClass = "bg-slate-100 text-slate-600",
}) => (
  <div className="flex items-start gap-3">
    {icon ? <IconDot className={iconClass}>{icon}</IconDot> : null}
    <div>
      <p
        className={`text-[11px] font-medium uppercase tracking-wide text-slate-400`}
      >
        {label}
      </p>
      <p
        className={`${
          label === "Paid" || label === "Lock Prices"
            ? "text-[.7rem]"
            : "text-sm"
        } font-semibold flex items-center justify-center ${
          label === "Paid" || label === "Lock Prices"
            ? value === "FALSE"
              ? "text-rose-600 bg-rose-50 px-2 py-1 rounded-full"
              : "text-green-600 bg-green-50 px-2 py-1 rounded-full"
            : "text-slate-800"
        } w-full`}
      >
        {label === "Paid"
          ? value === "FALSE"
            ? "Unpaid"
            : "Paid"
          : value || "—"}
      </p>
    </div>
  </div>
);
const Row = ({ left, right, bold }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className={bold ? "font-semibold text-slate-800" : "text-slate-500"}>
      {left}
    </span>
    <span className={bold ? "font-semibold text-slate-900" : ""}>{right}</span>
  </div>
);
const TimelineItem = ({ icon, title, subtitle, tone = "success" }) => {
  const toneMap = {
    success: "text-emerald-500 bg-emerald-50",
    info: "text-sky-500 bg-sky-50",
  };
  return (
    <div className="flex items-center gap-3">
      <IconDot className={`text-lg ${toneMap[tone]}`}>{icon}</IconDot>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
  );
};

/* ---- Badges for methods ---- */
const methodTone = (val) => {
  const v = (val || "").toString().toUpperCase();
  if (["CARD", "CREDIT", "DEBIT", "SQUARE"].includes(v)) return "info";
  if (["CASH", "CHECK"].includes(v)) return "warning";
  if (["UPS", "UPS GROUND", "FEDEX", "USPS", "DHL", "PICKUP"].includes(v))
    return "success";
  return "gray";
};
const MethodBadge = ({ label, value, icon }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <Chip tone={methodTone(value)}>
      {icon}
      <span>{value || "—"}</span>
    </Chip>
  </div>
);

/* ---- Tracking Preview (clickable image opens link) ---- */
const TrackingPreview = ({ href, imageSrc, alt = "Tracking map" }) => {
  if (!href && !imageSrc) return <span className="text-slate-400">—</span>;
  const src = href || undefined;
  return (
    <a
      href={href || imageSrc}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl ring-1 transition hover:shadow-md"
      style={{ borderColor: THEME.border }}
      title="Open tracking in new tab"
    >
      {src ? (
        <img
          src={trackImg}
          alt={alt}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-slate-50 text-slate-400">
          No preview
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 hidden items-end justify-end p-2 group-hover:flex">
        <span className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
          Open
        </span>
      </div>
    </a>
  );
};

/* ---------------- component ---------------- */
export default function OrderDetail({ order, loading = false }) {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const items = Array.isArray(order?.items)
      ? order.items
      : Array.isArray(order?.Items)
      ? order.Items
      : [];
    setItems(items);
  }, [order, deleting]);

  const subtotal = items.reduce(
    (s, it) => s + toNumber(it?.Total ?? it?.total),
    0
  );
  const shipping = toNumber(order?.ShippingCost);
  const tax = toNumber(order?.Tax);
  const grand = (subtotal + shipping + tax).toFixed(2);

  // State for delete confirmation
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "", message: "" });

  const { mutateAsync: deleteOrderItem, isPending: deletingItem } =
    useDeleteOrderItem();

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        console.log(itemToDelete);
        await deleteOrderItem(itemToDelete._id); // Delete the item
        setDeletePopupVisible(false); // Close the popup
        setDeleting(true);
        setToast({
          open: true,
          type: "success",
          message: "Order item deleted successfully!",
        });
      } catch (error) {
        console.error("Delete failed:", error);
        setToast({
          open: true,
          type: "error",
          message: "An error occurred. Please try again.",
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopupVisible(false); // Close the popup without deleting
  };

  const DeleteConfirmationPopup = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">
          Are you sure you want to delete this item?
        </h3>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onConfirm}
            className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ${
              deletingItem ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {deletingItem ? "Deleting..." : "Confirm"}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="p-8 text-center text-slate-500">Loading order…</Card>
    );
  }

  return (
    <Page>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-6 mt-2">Order Details</h1>
        <button
          type="button"
          onClick={() => navigate(`/create-order-item/${order.OrderID}`)}
          className="p-1 font-medium rounded-[5px] flex items-center gap-2 bg-[#f1f0ff] text-[#4F46E5] px-3 py-2 hover:bg-[#eeedff] disabled:opacity-40"
        >
          Add Item
          <FiPlus size={16} className="text-[#4F46E5]" />
        </button>
      </div>

      <div className="flex lg:flex-row flex-col justify-between gap-6">
        <Card className="w-full lg:w-[75%]">
          <div className="rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 p-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-4">
              <div className="space-y-4">
                <K
                  label="Order #"
                  value={
                    <span className="text-rose-600">{order?.Label || ""}</span>
                  }
                  icon={<FiHash />}
                  iconClass="bg-rose-50 text-rose-600"
                />
              </div>
              <div className="space-y-4">
                <K
                  label="Status"
                  value={<Chip tone="success">{order?.OrderStatus || ""}</Chip>}
                  icon={<FiCheckCircle />}
                  iconClass="bg-emerald-50 text-emerald-600"
                />
              </div>
              <div className="space-y-4">
                <K
                  label="Client"
                  value={order?.ClientID || ""}
                  icon={<FiUser />}
                  iconClass="bg-sky-50 text-sky-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <K
                  label="Sales Rep"
                  value={order?.SalesRep || ""}
                  icon={<FiMail />}
                  iconClass="bg-fuchsia-50 text-fuchsia-600"
                />
              </div>
              <div className="space-y-4">
                <K
                  label="Paid"
                  value={order?.Paid || ""}
                  icon={<FiDollarSign />}
                  iconClass="bg-teal-50 text-teal-600"
                />
              </div>
              <div className="space-y-4">
                <K
                  label="Lock Prices"
                  value={String(order?.LockPrices ?? "")}
                  icon={<FiTag />}
                  iconClass="bg-slate-100 text-slate-600"
                />
              </div>
            </div>

            {/* Ship To */}
            <div className="mt-6">
              <div
                className="rounded-2xl bg-rose-50/40 p-4 ring-1"
                style={{ borderColor: THEME.border }}
              >
                <div className="flex items-start gap-3">
                  <IconDot className="bg-rose-100 text-rose-600">
                    <FiMapPin />
                  </IconDot>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      Ship To
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {order?.ShiptoAddress || "—"}
                    </p>
                    {/* <p className="text-sm text-slate-500">
                      {[order?.City, order?.State].filter(Boolean).join(", ")}
                    </p> */}
                  </div>
                  {/* <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50" style={{ borderColor: THEME.border }}>
                    <FiEdit2 /> Edit
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-5 w-full lg:w-[25%]">
          <SectionHeader title="Status History" />
          <div className="space-y-5">
            <TimelineItem
              icon={<FiCheckCircle />}
              tone="success"
              title={order?.OrderStatus || ""}
              // subtitle={`Order ID: ${order?.OrderID || ""}`}
            />
            <TimelineItem
              icon={<FiClock />}
              tone="info"
              title="Created Time"
              subtitle={fmtDate(order?.TimeStamp)}
            />
          </div>
        </Card>
      </div>

      {/* Items + Payment */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Order Items" />
          <div className="divide-y" style={{ borderColor: THEME.border }}>
            {items.map((it) => (
              <>
                <div
                  key={it._id || it.RecordID}
                  className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-4"
                >
                  <div className="flex items-center sm:col-span-1 ">
                    <Link to={`/edit-order-item/${it.OrderID}/${it._id}`}>
                      <FiEdit2
                        className="text-[#4f46e5] hover:text-[#4f46e5]/80"
                        size={16}
                      />
                    </Link>
                    <button
                      className="p-1 rounded hover:bg-red-50 ms-1"
                      title="Delete"
                      onClick={() => {
                        setItemToDelete(it); // Store the item to delete
                        setDeletePopupVisible(true); // Show the confirmation popup
                      }}
                    >
                      <FiTrash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                  <div className="sm:col-span-6">
                    <p className="font-semibold text-slate-800">
                      {it.Description}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <FiTag /> SKU: {it.SKU}
                      </span>
                      <span>UOM: {it.UOM}</span>
                      <span>Warehouse: {it.Warehouse}</span>
                      {it.LotNumber ? <span>Lot: {it.LotNumber}</span> : null}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FiPackage /> Qty: {it.QtyShipped}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      Price: {it.Price}
                    </p>
                  </div>
                  <div className="sm:col-span-2 flex items-start justify-end">
                    <p className="text-base font-semibold text-slate-900">
                      {it.Total}
                    </p>
                  </div>
                </div>
              </>
            ))}
            {items.length === 0 && (
              <div className="py-6 text-center text-sm text-slate-500">
                No items.
              </div>
            )}
          </div>
          <div
            className="mt-4 border-t pt-4"
            style={{ borderColor: THEME.border }}
          >
            <Row left="Items Subtotal :" right={fmtMoney(subtotal)} />
            <Row left="Shipping Cost :" right={fmtMoney(order?.ShippingCost)} />
            <Row left="Tax :" right={fmtMoney(order?.Tax)} />
            <Row left="Payment Amount :" right={`$${grand}`} bold />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Payment & Shipping" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MethodBadge
              label="Payment Method"
              value={order?.PaymentMethod}
              icon={<FiDollarSign />}
            />
            <MethodBadge
              label="Shipping Method"
              value={order?.ShippingMethod}
              icon={<FiTruck />}
            />

            <div className="sm:col-span-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1">
                Tracking
              </p>
              {/* If you have a dedicated image URL from API use order.TrackingImageUrl; otherwise it will open order.Tracking */}
              <TrackingPreview
                href={order?.Tracking}
                imageSrc={order?.TrackingImageUrl || order?.TrackingImage}
              />
            </div>

            <div className="space-y-4">
              <K
                label="Payment Date"
                value={order?.PaymentDate}
                icon={<FiClock />}
                iconClass="bg-amber-50 text-amber-600"
              />
            </div>
            <div className="space-y-4">
              <K
                label="Shipped Date"
                value={order?.ShippedDate}
                icon={<FiClock />}
                iconClass="bg-sky-50 text-sky-600"
              />
            </div>
          </div>
        </Card>

        {/* Toast Notification */}
        {toast.open && (
          <ToastNotification
            open={toast.open}
            type={toast.type}
            title={toast.type === "success" ? "Success" : "Error"}
            message={toast.message}
            onClose={() => setToast({ ...toast, open: false })}
          />
        )}
      </div>

      {/* Confirmation Popup */}
      {isDeletePopupVisible && (
        <DeleteConfirmationPopup
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </Page>
  );
}
