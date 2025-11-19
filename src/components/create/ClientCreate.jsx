// src/components/create/ClientCreate.jsx
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useUserNames } from "../../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../SearchableSelect";

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

  const navigate = useNavigate();

  // Get User Names
  const { data: userNames } = useUserNames();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Single submit handler for both create & edit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      // numeric normalization where appropriate
      forecastedAmount: toNumberOrNull(form.forecastedAmount),
      interactionCount: toNumberOrNull(form.interactionCount),
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
          <SearchableSelect
            label="Owned By *"
            value={form.fullName}
            onChange={update("fullName")}
            options={userNames || []}
            placeholder="Search owner (e.g. Sam Bukhari)"
          />
          <Input
            label="Client Name *"
            value={form.name}
            onChange={update("name")}
            required
            placeholder="Fire Vape Lakes"
          />
          <SearchableSelect
            label="Contact Status *"
            value={form.contactStatus}
            onChange={update("contactStatus")}
            options={STATUS_OPTIONS}
            placeholder="New Prospect"
          />
          <SearchableSelect
            label="Contact Type *"
            value={form.contactType}
            onChange={update("contactType")}
            options={TYPE_OPTIONS}
            placeholder="Current Customer"
          />
          <SearchableSelect
            label="Company Type *"
            value={form.companyType}
            onChange={update("companyType")}
            options={COMPANY_TYPE_OPTIONS}
            placeholder="Smoke Shop"
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={update("description")}
            placeholder="Short note about this client or opportunity"
          />
        </Section>

        {/* Contact */}
        <Section title="Contact Information">
          <Input
            label="Phone *"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            required
            placeholder="(561) 410-6868"
            inputMode="tel"
            pattern="^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$"
            title="Please enter a valid phone number like (561) 410-6868"
          />

          <Input
            label="Email *"
            type="email"
            value={form.email}
            onChange={update("email")}
            required
            placeholder="y.abuelhawa@gmail.com"
          />
          <Input
            label="Website"
            value={form.website}
            onChange={update("website")}
            placeholder="https://client-website.com"
          />
          <Input
            label="Facebook Page"
            value={form.facebookPage}
            onChange={update("facebookPage")}
            placeholder="https://facebook.com/client-page"
          />
        </Section>

        {/* Address */}
        <Section title="Address">
          <Input
            label="Address *"
            value={form.address}
            onChange={update("address")}
            required
            placeholder="5335 N. Military Trl. #30"
          />
          <Input
            label="City *"
            value={form.city}
            onChange={update("city")}
            required
            placeholder="West Palm Bch"
          />
          <Input
            label="State *"
            value={form.state}
            onChange={update("state")}
            required
            placeholder="Florida"
          />
          <Input
            label="Postal Code *"
            type="text"
            value={form.postalCode}
            onChange={update("postalCode")}
            required
            placeholder="33401"
            inputMode="numeric"
            pattern="^\d{5}(-\d{4})?$"
            title="Please enter a valid ZIP code like 33401 or 33401-1234"
          />
        </Section>

        {/* Business */}
        <Section title="Business Info">
          <Input
            label="Industry"
            value={form.industry}
            onChange={update("industry")}
            placeholder="e.g. Smoke Shop / Distributor"
          />
          <Input
            label="Forecasted Amount"
            value={form.forecastedAmount}
            onChange={update("forecastedAmount")}
            placeholder="e.g. 5000"
          />
          <Input
            label="Interaction Count"
            value={form.interactionCount}
            onChange={update("interactionCount")}
            placeholder="e.g. 3"
          />
          <Input
            label="Projected Close Date"
            type="date"
            value={form.projectedCloseDate ?? ""}
            onChange={update("projectedCloseDate")}
          />
          <SearchableSelect
            label="Default Shipping Terms"
            value={form.defaultShippingTerms}
            onChange={update("defaultShippingTerms")}
            options={SHIPPING_OPTIONS}
            placeholder="UPS Ground"
          />
          <SearchableSelect
            label="Default Payment Method"
            value={form.defaultPaymentMethod}
            onChange={update("defaultPaymentMethod")}
            options={PAYMENT_OPTIONS}
            placeholder="Mobile Check Deposit"
          />
        </Section>

        {/* Misc */}
        <Section title="Other">
          <Input
            label="Profile Image URL"
            value={form.profileImage}
            onChange={update("profileImage")}
            placeholder="https://..."
          />
          <Input
            label="Folder Link"
            value={form.folderLink}
            onChange={update("folderLink")}
            placeholder="Shared drive / Dropbox link"
          />
          <Input
            label="Name on Card (text)"
            value={form.nameOnCard}
            onChange={update("nameOnCard")}
            placeholder="Fire Vape Smoke Shop"
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
            placeholder="33415"
          />
          <Textarea
            label="Last Note"
            value={form.lastNote}
            onChange={update("lastNote")}
            placeholder="Any last note about this client..."
          />
        </Section>

        <div className="flex justify-end items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => navigate("/clients")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              submitting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
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
