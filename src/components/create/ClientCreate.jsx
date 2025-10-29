// src/components/create/ClientCreate.jsx
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const STATUS_OPTIONS = [
  "Sampling",
  "New Prospect",
  "Uncategorized",
  "Closed lost",
  "Initial Contact",
  "Closed won",
  "Committed",
  "Consideration",
];

const TYPE_OPTIONS = [
  "Potential Customer",
  "Current Customer",
  "Inactive Customer",
  "Uncategorized",
  "Other",
];

const COMPANY_TYPE_OPTIONS = [
  "Smoke Shop",
  "Vape Store",
  "Shop",
  "Distro",
  "Master Distro",
  "Broker/Jobber",
  "Manufacturer",
  "Dispensary",
  "Kratom Dispensary",
  "Kratom Dispensary/Distributor",
  "CBD Dispensary",
  "Kava/Kratom Bar",
  "Kava Bar",
  "Health Food Store",
  "Tobacco Shop",
  "Liquor store",
  "Online Retailer",
  "Franchise",
  "Spa",
  "Individual",
  "Beer and Wine Bar",
  "Market",
  "Amherst Client",
  "Sully's Client",
  "Whole Saler",
  "Gas station",
  "Vape Empire",
  "Other",
];

const SHIPPING_OPTIONS = [
  "UPS Ground",
  "UPS 2nd Day Air",
  "UPS 3 Day Select",
  "UPS Next Day Air Saver",
  "USPS Ground Advantage",
  "Will Call",
  "Local Delivery",
  "Freight Via SAIA",
];

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

/* ----------------------------- UI Primitives ----------------------------- */
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
        type={props.type}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        {...props}
      />
    </label>
  );
}

function Textarea({ label, rows = 3, ...props }) {
  return (
    <label className="flex flex-col gap-1 md:col-span-2">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <textarea
        rows={rows}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        {...props}
      />
    </label>
  );
}

function Select({ label, options = [], ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <select
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function toNumberOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/* ------------------------------ Main Form ------------------------------- */
export default function ClientCreate({
  initial = {},
  onSubmit,
  submitting = false,
  mode = "create", // "create" | "edit"
}) {
  const [form, setForm] = useState(() => ({
    externalId: initial.externalId ?? "",
    name: initial.name ?? "",
    description: initial.description ?? "",
    ownedBy: initial.ownedBy ?? "",
    contactStatus: initial.contactStatus ?? "New Prospect",
    contactType: initial.contactType ?? "",
    companyType: initial.companyType ?? "",
    phone: initial.phone ?? "",
    email: initial.email ?? "",
    address: initial.address ?? "",
    city: initial.city ?? "",
    state: initial.state ?? "",
    postalCode: initial.postalCode ?? "",
    website: initial.website ?? "",
    facebookPage: initial.facebookPage ?? "",
    industry: initial.industry ?? "",
    forecastedAmount: initial.forecastedAmount ?? "",
    interactionCount: initial.interactionCount ?? "",
    profileImage: initial.profileImage ?? "",
    folderLink: initial.folderLink ?? "",
    nameOnCard: initial.nameOnCard ?? "",
    expirationDateText: initial.expirationDateText ?? "",
    ccNumberText: initial.ccNumberText ?? "",
    securityCodeText: initial.securityCodeText ?? "",
    zipCodeText: initial.zipCodeText ?? "",
    lastNote: initial.lastNote ?? "",
    projectedCloseDate: initial.projectedCloseDate
      ? new Date(initial.projectedCloseDate).toISOString().slice(0, 10)
      : "",
    fullName: initial.fullName ?? "",
    defaultShippingTerms: initial.defaultShippingTerms ?? "",
    defaultPaymentMethod: initial.defaultPaymentMethod ?? "",
  }));

  const update = (k) => (e) => setForm((f) => {
    console.log(e.target.value);
    return ({ ...f, [k]: e.target.value, })
  });

  // Single submit handler for both create & edit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      // numeric normalization where appropriate
      forecastedAmount: toNumberOrNull(form.forecastedAmount),
      interactionCount: toNumberOrNull(form.interactionCount),
      // If you actually need these as text (to keep leading zeros), remove casts below:
      expirationDateText: form.expirationDateText,
      ccNumberText: toNumberOrNull(form.ccNumberText),
      securityCodeText: toNumberOrNull(form.securityCodeText),
      projectedCloseDate: form.projectedCloseDate
        ? new Date(form.projectedCloseDate)
        : undefined,
    };

    // Clean empty-string → undefined (avoid confusing server-side validators)
    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") payload[k] = undefined;
    });

    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto p-3 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <div className="text-xl font-semibold text-slate-900">
            {mode === "create" ? "Add Client" : "Edit Client"}
          </div>
          <div className="text-sm text-slate-500">
            Fill in the client details and save.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic */}
        <Section title="Basic Information">
          <Input
            label="External ID"
            value={form.externalId}
            onChange={update("externalId")}
          />
          <Input
            label="Owned By (email)"
            value={form.ownedBy}
            onChange={update("ownedBy")}
          />
          <Input
            label="Client Name *"
            value={form.name}
            onChange={update("name")}
            required
          />
          <Select
            label="Contact Status"
            value={form.contactStatus}
            onChange={update("contactStatus")}
            options={STATUS_OPTIONS}
          />
          <Select
            label="Contact Type"
            value={form.contactType}
            onChange={update("contactType")}
            options={TYPE_OPTIONS}
          />
          <Select
            label="Company Type"
            value={form.companyType}
            onChange={update("companyType")}
            options={COMPANY_TYPE_OPTIONS}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={update("description")}
          />
        </Section>

        {/* Contact */}
        <Section title="Contact Information">
          <Input label="Phone" value={form.phone} onChange={update("phone")} />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
          />
          <Input
            label="Website"
            value={form.website}
            onChange={update("website")}
          />
          <Input
            label="Facebook Page"
            value={form.facebookPage}
            onChange={update("facebookPage")}
          />
        </Section>

        {/* Address */}
        <Section title="Address">
          <Input
            label="Address"
            value={form.address}
            onChange={update("address")}
          />
          <Input label="City" value={form.city} onChange={update("city")} />
          <Input label="State" value={form.state} onChange={update("state")} />
          <Input
            label="Postal Code"
            value={form.postalCode}
            onChange={update("postalCode")}
          />
        </Section>

        {/* Business */}
        <Section title="Business Info">
          <Input
            label="Industry"
            value={form.industry}
            onChange={update("industry")}
          />
          <Input
            label="Forecasted Amount"
            value={form.forecastedAmount}
            onChange={update("forecastedAmount")}
          />
          <Input
            label="Interaction Count"
            value={form.interactionCount}
            onChange={update("interactionCount")}
          />
          <Input
            label="Projected Close Date"
            type="date"
            value={form.projectedCloseDate ?? ""}
            onChange={update("projectedCloseDate")}
          />
          <Select
            label="Default Shipping Terms"
            value={form.defaultShippingTerms}
            onChange={update("defaultShippingTerms")}
            options={SHIPPING_OPTIONS}
          />
          <Select
            label="Default Payment Method"
            value={form.defaultPaymentMethod}
            onChange={update("defaultPaymentMethod")}
            options={PAYMENT_OPTIONS}
          />
        </Section>

        {/* Misc */}
        <Section title="Other">
          <Input
            label="Profile Image URL"
            value={form.profileImage}
            onChange={update("profileImage")}
          />
          <Input
            label="Folder Link"
            value={form.folderLink}
            onChange={update("folderLink")}
          />
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={update("fullName")}
          />
          <Input
            label="Name on Card (text)"
            value={form.nameOnCard}
            onChange={update("nameOnCard")}
          />
          <Input
            type="date"
            label="Expiration Date (text/number)"
            value={form.expirationDateText}
            onChange={update("expirationDateText")}
          />
          <Input
            label="CC Number (text/number)"
            value={form.ccNumberText}
            onChange={update("ccNumberText")}
          />
          <Input
            label="Security Code (text/number)"
            value={form.securityCodeText}
            onChange={update("securityCodeText")}
          />
          <Input
            label="Zip Code (text)"
            value={form.zipCodeText}
            onChange={update("zipCodeText")}
          />
          <Textarea
            label="Last Note"
            value={form.lastNote}
            onChange={update("lastNote")}
          />
        </Section>

        <div className="flex justify-end items-center gap-2">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              submitting ? "bg-slate-400" : "bg-slate-900 hover:bg-black"
            }`}
          >
            {submitting ? (
              <ClipLoader size={18} color="#fff" />
            ) : mode === "create" ? (
              "Add Client"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
