// src/components/orders/CreateOrEditOrder.jsx
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useCreateOrder, useUpdateOrder } from "../../hooks/useOrders";
import { useUserNames, useClientNames } from "../../hooks/useLookups";

/** Reuse these or customize as needed */
const PAYMENT_OPTIONS = [
  "Credit Card",
  "CC#",
  "Auth Payment Link",
  "Mobile Check Deposit",
  "ACH",
  "Cash",
  "Nothing Due",
  "Check By Mail",
  "Net Terms",
  "Other",
];

const SHIPPING_METHODS = [
  "UPS Ground",
  "UPS 2nd Day Air",
  "UPS 3 Day Select",
  "UPS Next Day Air Saver",
  "USPS Ground Advantage",
  "Will Call",
  "Local Delivery",
  "Freight Via SAIA",
];

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipping",
  "Delivered",
  "Completed",
  "Issued",
  "Pending Payment",
  "Cancelled",
  "Returned",
];

/* ----------------------------- small UI bits ----------------------------- */
function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
      <div className="text-sm font-semibold text-slate-800 mb-3">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {children}
      </div>
    </div>
  );
}
function Input({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        {...props}
      />
    </label>
  );
}

function Select({ label, options = [], value, ...props }) {
  const hasValue = value != null && value !== "";
  const inList = hasValue && options.includes(String(value));

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <select
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
        value={value ?? ""}
        {...props}
      >
        <option key="__placeholder" value="">— Select —</option>
        {!inList && hasValue && (
          <option key="__current" value={String(value)}>
            (current) {String(value)}
          </option>
        )}
        {options.map((o, i) => (
          <option key={`${o}__${i}`} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

const toNum = (v) => {
  const n = Number(v);
  return Number?.isFinite(n) ? n : undefined;
};

/* ------------------------------- Main Form ------------------------------- */
export default function CreateOrEditOrder({
  mode = "create",
  initial = {},
  onDone,
}) {
  const navigate = useNavigate();

  // Get Client Names
  const { data: users } = useUserNames();

  // Get Clients
  const { data: clients } = useClientNames();

  // IMPORTANT: backend expects raw ids (ClientID = externalId; SalesRep = email)
  const [form, setForm] = useState(() => ({
    ClientID: initial?.ClientID ?? "",   // externalId string
    SalesRep: initial?.SalesRep ?? "",   // email string
    Discount: initial?.Discount ?? "",
    PaymentMethod: initial?.PaymentMethod ?? "",
    ShippedDate: initial?.ShippedDate ?? "",
    ShippingMethod: initial?.ShippingMethod ?? "",
    ShippingCost: initial?.ShippingCost ?? "",
    Tax: initial?.Tax ?? "",
    Paid: initial?.Paid ?? "",
    ShiptoAddress: initial?.ShiptoAddress ?? "",
    City: initial?.City ?? "",
    State: initial?.State ?? "",
    PaymentDate: initial?.PaymentDate ?? "",
    PaymentAmount: initial?.PaymentAmount ?? "",
    LockPrices: initial?.LockPrices ?? "",
    OrderStatus: initial?.OrderStatus ?? "Pending",
  }));

  useEffect(() => {
    // run this hydrator ONLY in edit mode AND when we actually have a doc
    if (mode !== "edit") return;
    if (!initial || !initial._id) return;

    setForm((prev) => ({
      ...prev,
      ClientID: initial.ClientID ?? "",
      SalesRep: initial.SalesRep ?? "",
      Discount: initial.Discount ?? "",
      PaymentMethod: initial.PaymentMethod ?? "",
      ShippedDate: initial.ShippedDate,
      ShippingMethod: initial.ShippingMethod ?? "",
      ShippingCost: initial.ShippingCost ?? "",
      Tax: initial.Tax ?? "",
      Paid: initial.Paid ?? "",
      ShiptoAddress: initial.ShiptoAddress ?? "",
      City: initial.City ?? "",
      State: initial.State ?? "",
      PaymentDate: initial.PaymentDate,
      PaymentAmount: initial.PaymentAmount ?? "",
      LockPrices: initial.LockPrices ?? "",
      OrderStatus: String(initial.OrderStatus || "pending").toLowerCase(),
    }));
    // only re-run when we switch to edit for a different record
  }, [mode, initial?._id]);

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const { mutateAsync: createMutate, isPending: creating } = useCreateOrder();
  const { mutateAsync: updateMutate, isPending: updating } = useUpdateOrder();

  const busy = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // clean payload (empty strings -> undefined)
    const payload = { ...form };
    // Numeric-ish fields (if you want numeric in DB, otherwise keep text)
    // payload.ShippingCost = toNum(payload.ShippingCost);
    // payload.Tax = toNum(payload.Tax);
    // payload.PaymentAmount = toNum(payload.PaymentAmount);

    console.log(payload);

    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") payload[k] = undefined;
    });

    try {
      if (mode === "create") {
        await createMutate(payload);
      } else {
        // for update, you’ll pass the Mongo _id of the order’s doc
        await updateMutate({ id: initial._id, payload });
      }
      // onDone?.();
      // default navigate back to list
      navigate("/orders");
    } catch (err) {
      console.error(err?.message || err);
      // add your toast here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto p-3 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <div className="text-xl font-semibold text-slate-900">
            {mode === "create" ? "Add Order" : "Edit Order"}
          </div>
          <div className="text-sm text-slate-500">Fill the order details and save.</div>
        </div>
      </div>

      <div className="space-y-4">
        <Section title="Order Basics">
          <Select label={`Client ID ${mode === "create" ? "(required)" : ""}`} value={form.ClientID} onChange={update("ClientID")} options={clients} required={mode === "create"} />
          <Select label={`Sales Rep ${mode === "create" ? "(required)" : ""}`} value={form.SalesRep} onChange={update("SalesRep")} options={users} required={mode === "create"} />
          <Select label={`Order Status ${mode === "create" ? "(required)" : ""}`} value={form.OrderStatus} onChange={update("OrderStatus")} options={ORDER_STATUSES} required={mode === "create"} />
          <Select label={`Lock Prices ${mode === "create" ? "(required)" : ""}`} value={form.LockPrices} onChange={update("LockPrices")} options={["TRUE", "FALSE"]} required={mode === "create"} />
          <Input label={`City ${mode === "create" ? "(required)" : ""}`} value={form.City} onChange={update("City")} required={mode === "create"} />
          <Input label={`State ${mode === "create" ? "(required)" : ""}`} value={form.State} onChange={update("State")} required={mode === "create"} />
          <Input label="Ship To Address" value={form.ShiptoAddress} onChange={update("ShiptoAddress")} />
        </Section>

        <Section title="Shipping & Payment">
          <Input label="Shipped Date" type="date" value={form.ShippedDate} onChange={update("ShippedDate")} />
          <Select label="Shipping Method" value={form.ShippingMethod} onChange={update("ShippingMethod")} options={SHIPPING_METHODS} />
          <Input label="Shipping Cost" value={form.ShippingCost} onChange={update("ShippingCost")} />
          <Input label="Tax" value={form.Tax} onChange={update("Tax")} />
          <Select label="Payment Method" value={form.PaymentMethod} onChange={update("PaymentMethod")} options={PAYMENT_OPTIONS} />
          <Input label="Paid" value={form.Paid} onChange={update("Paid")} />
          <Input label="Payment Date" type="date" value={form.PaymentDate} onChange={update("PaymentDate")} />
          <Input label="Payment Amount" value={form.PaymentAmount} onChange={update("PaymentAmount")} />
          <Input label="Discount" value={form.Discount} onChange={update("Discount")} />
        </Section>

        <div className="flex justify-end items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => navigate("/orders")}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className={`px-4 py-2 rounded-lg text-white ${busy ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {busy ? <ClipLoader size={18} color="#fff" /> : mode === "create" ? "Add Order" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
