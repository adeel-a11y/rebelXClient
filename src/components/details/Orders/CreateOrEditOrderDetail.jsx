import React, { useState } from "react";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useCreateOrderItem, useUpdateOrderItem } from "../../../hooks/useOrders";
import { useNavigate, useParams } from "react-router-dom";

const UOM_OPTIONS = ["ea", "box", "pack", "kg", "lb", "g", "oz"];

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
        <option key="__placeholder" value="">
          — Select —
        </option>
        {!inList && hasValue && (
          <option key="__current" value={String(value)}>
            (current) {String(value)}
          </option>
        )}
        {options.map((o, i) => (
          <option key={`${o}__${i}`} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

const CreateOrEditOrderDetail = ({ mode = "create", initial = {}, onDone }) => {
  const { orderId } = useParams();
  console.log("orderId", orderId);

  const [form, setForm] = useState(() => ({
    OrderID: orderId,
    Warehouse: initial?.Warehouse ?? "",
    SKU: initial?.SKU ?? "",
    Description: initial?.Description ?? "",
    LotNumber: initial?.LotNumber ?? "",
    QtyShipped: initial?.QtyShipped ?? "",
    UOM: initial?.UOM ?? "",
    Price: initial?.Price ?? "",
    Total: initial?.Total ?? "",
  }));

  const navigate = useNavigate();

  useEffect(() => {
    if (mode !== "edit") return;
    if (!initial || !initial._id) return;

    setForm((prev) => ({
      ...prev,
      OrderID: orderId,
      Warehouse: initial.Warehouse ?? "",
      SKU: initial.SKU ?? "",
      Description: initial.Description ?? "",
      LotNumber: initial.LotNumber ?? "",
      QtyShipped: initial.QtyShipped ?? "",
      UOM: initial.UOM ?? "",
      Price: initial.Price ?? "",
      Total: initial.Total ?? "",
    }));
  }, [mode, initial?._id]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { mutateAsync: createMutate, isPending: creating } =
    useCreateOrderItem();
  const { mutateAsync: updateMutate, isPending: updating } =
    useUpdateOrderItem();
  const busy = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") payload[k] = undefined;
    });

    try {
      if (mode === "create") {
        await createMutate(payload);
      } else {
        await updateMutate({ id: initial._id, payload });
      }
      navigate("/orders");
    } catch (err) {
      console.error(err?.message || err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full mx-auto p-3 md:p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <div className="text-xl font-semibold text-slate-900">
              {mode === "create" ? "Add Order Item" : "Edit Order Item"}
            </div>
            <div className="text-sm text-slate-500">
              Fill the item details and save.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Section title="Order Details">
            <Input
              label={`Warehouse ${mode === "create" ? "(required)" : ""}`}
              value={form?.Warehouse}
              onChange={update("Warehouse")}
              placeholder="e.g., Toda San Francisco"
              required={mode === "create"}
            />
            <Input
              label={`SKU ${mode === "create" ? "(required)" : ""}`}
              value={form.SKU}
              onChange={update("SKU")}
              placeholder="e.g., SKU9274"
              required={mode === "create"}
            />
            <Input
              label={`Description ${mode === "create" ? "(required)" : ""}`}
              value={form.Description}
              onChange={update("Description")}
              placeholder="e.g., Great product very good product."
              required={mode === "create"}
            />
            <Input
              label={`Lot Number ${mode === "create" ? "(required)" : ""}`}
              value={form.LotNumber}
              onChange={update("LotNumber")}
              placeholder="e.g., 135153"
              required={mode === "create"}
            />
            <Input
              label={`Qty Shipped ${mode === "create" ? "(required)" : ""}`}
              value={form.QtyShipped}
              onChange={update("QtyShipped")}
              placeholder="e.g., 2"
              required={mode === "create"}
            />
            <Select
              label={`UOM ${mode === "create" ? "(required)" : ""}`}
              value={form.UOM}
              onChange={update("UOM")}
              options={UOM_OPTIONS}
              required={mode === "create"}
            />
            <Input
              label={`Price ${mode === "create" ? "(required)" : ""}`}
              value={form.Price}
              onChange={update("Price")}
              placeholder="e.g., $100"
              required={mode === "create"}
            />
            <Input
              label={`Total ${mode === "create" ? "(required)" : ""}`}
              value={form.Total}
              onChange={update("Total")}
              placeholder="e.g., $200"
              required={mode === "create"}
            />
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
              className={`px-4 py-2 rounded-lg text-white ${
                busy
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {busy ? (
                <ClipLoader size={18} color="#fff" />
              ) : mode === "create" ? (
                "Add Order"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateOrEditOrderDetail;
