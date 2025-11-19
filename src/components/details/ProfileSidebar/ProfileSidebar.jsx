// src/components/details/client-details/ProfileSidebar/ProfileSidebar.jsx
import * as React from "react";
import { Avatar, Box, Card, CardContent, Stack, Typography } from "@mui/material";
import {
  FiPhone, FiMail, FiMapPin, FiGlobe, FiFacebook, FiUser,
  FiHash, FiCalendar, FiBriefcase, FiDollarSign, FiTrendingUp,
  FiFolder, FiCreditCard, FiTruck, FiLock,
} from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router-dom";
import { useClient, useUpdateClient } from "../../../hooks/useClients";
import {
  STATUS_COLORS, PAYMENT_COLORS, SHIPPING_COLORS, COMPANY_TYPE_COLORS,
  CONTACT_TYPE_COLORS, fmtDate, fullAddressFromClient, gmapsLink, formatExpiry,
} from "../ClientDetails/helpers";
import KV from "./KV";
import GroupSection from "./GroupSection";
import EnumRow from "./EnumRow";
import CreditCardPreview from "./CreditCardPreview";

export default function ProfileSidebar() {
  const { id } = useParams();
  const { data: client, isLoading, isError, error } = useClient(id);

  // hook bound to this client id
  const { mutateAsync: updateClient, isPending: saving } = useUpdateClient(id);

  const [editingGroup, setEditingGroup] = React.useState(null); // contact|status|projection|credit|shipping|notes
  const [draft, setDraft] = React.useState({});

  const startEdit = (group) => {
    setEditingGroup(group);
    setDraft(makeDraft(client, group));
  };
  const cancelEdit = () => {
    setEditingGroup(null);
    setDraft({});
  };
  const saveEdit = async () => {
    // Only send the current group's fields
    await updateClient(draft);
    setEditingGroup(null);
    setDraft({});
  };
  const setField = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  if (isLoading) return <Card sx={{ p: 2 }}><Typography>Loading…</Typography></Card>;
  if (isError)   return <Card sx={{ p: 2 }}><Typography color="error">{String(error?.message || "Failed to load client")}</Typography></Card>;

  const shopName = client?.name || "—";
  const contactName = client?.fullName || "—";
  const createdAt = fmtDate(client?.createdAt);
  const fullAddr = fullAddressFromClient(client);

  const ccName = client?.nameOnCard;
  const ccNumberText = client?.ccNumberText;
  const ccExpiryRaw = client?.expirationDateText;
  const ccExpiry = formatExpiry(ccExpiryRaw);
  const ccCvc = client?.securityCodeText;
  const ccZip = client?.zipCodeText;

  return (
    <Card sx={{ p: 0, overflow: "hidden", position: "relative" }}>
      {/* FULL OVERLAY WHILE SAVING */}
      {saving && (
        <Box
          sx={{
            position: "absolute", inset: 0, zIndex: 10,
            bgcolor: "rgba(255,255,255,0.6)", display: "grid", placeItems: "center"
          }}
        >
          <div className="flex items-center gap-3 text-gray-700">
            <ClipLoader size={28} />
            <span>Updating…</span>
          </div>
        </Box>
      )}

      {/* Banner */}
      <Box sx={{ position: "relative", height: 120, background: "linear-gradient(135deg,#ff6060 0%,#6c7bff 50%,#5b7fff 100%)" }}>
        <Avatar
          src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
          sx={{ width: 64, height: 64, border: "3px solid #fff", position: "absolute", left: 16, bottom: -24, boxShadow: "0 4px 10px rgba(0,0,0,.15)", backgroundColor: "#fff" }}
        />
      </Box>

      <CardContent sx={{ pt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "1rem" }}>{shopName}</Typography>
          <Typography sx={{ fontSize: ".85rem", color: "#4b5563", fontWeight: 500, display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", mt: 0.5 }}>
            <FiUser style={{ color: "#6366f1" }} /> {contactName}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: ".75rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
            <FiCalendar style={{ color: "#3b82f6" }} /> Created At {createdAt}
          </Typography>
        </Box>

        {/* ===== Contact Information ===== */}
        <GroupSection
          title="Contact Information"
          icon={<FiPhone />} iconBg="linear-gradient(135deg,#3b82f6,#6366f1)"
          groupKey="contact"
          isEditing={editingGroup === "contact"}
          onEdit={() => startEdit("contact")}
          onCancel={cancelEdit}
          onSave={saveEdit}
          saving={saving}
        >
          <div className="grid grid-cols-1 xl:grid-cols-2">
            <KV
              icon={<FiPhone />} iconColor="#10b981" label="Phone"
              value={editingGroup === "contact" ? draft.phone : client?.phone}
              link={editingGroup === "contact" ? undefined : (client?.phone ? `tel:${client.phone}` : undefined)}
              editMode={editingGroup === "contact"} onChange={(v) => setField("phone", v)}
            />
            <KV
              icon={<FiMail />} iconColor="#6366f1" label="Email"
              value={editingGroup === "contact" ? draft.email : client?.email}
              link={editingGroup === "contact" ? undefined : (client?.email ? `mailto:${client.email}` : undefined)}
              editMode={editingGroup === "contact"} onChange={(v) => setField("email", v)}
            />
            <KV
              icon={<FiMapPin />} iconColor="#ef4444" label="Address"
              value={editingGroup === "contact" ? draft.address : client?.address}
              link={editingGroup === "contact" ? undefined : gmapsLink(fullAddr) || undefined}
              editMode={editingGroup === "contact"} onChange={(v) => setField("address", v)}
            />
            <KV
              icon={<FiGlobe />} iconColor="#0ea5e9" label="Website"
              value={editingGroup === "contact" ? draft.website : client?.website}
              link={editingGroup !== "contact" ? client?.website : undefined}
              editMode={editingGroup === "contact"} onChange={(v) => setField("website", v)}
            />
            <KV
              icon={<FiFacebook />} iconColor="#3b5998" label="Facebook Page"
              value={editingGroup === "contact" ? draft.facebookPage : client?.facebookPage}
              link={editingGroup !== "contact" ? client?.facebookPage : undefined}
              editMode={editingGroup === "contact"} onChange={(v) => setField("facebookPage", v)}
            />
            <KV
              icon={<FiBriefcase />} iconColor="#14b8a6" label="Industry"
              value={editingGroup === "contact" ? draft.industry : client?.industry}
              editMode={editingGroup === "contact"} onChange={(v) => setField("industry", v)}
            />
          </div>
        </GroupSection>

        {/* ===== Client Status ===== */}
        <GroupSection
          title="Client Status" icon={<FiTrendingUp />}
          iconBg="linear-gradient(135deg,#14b8a6,#10b981)"
          groupKey="status" isEditing={editingGroup === "status"}
          onEdit={() => startEdit("status")} onCancel={cancelEdit} onSave={saveEdit}
          saving={saving}
        >
          <KV
            icon={<FiHash />} iconColor="#6366f1" label="Description"
            value={editingGroup === "status" ? draft.description : client?.description}
            editMode={editingGroup === "status"} onChange={(v) => setField("description", v)}
          />
          <div className="grid lg:grid-cols-2 2xl:grid-cols-3">
            <EnumRow
              label="Contact Status"
              value={editingGroup === "status" ? draft.contactStatus : client?.contactStatus}
              map={STATUS_COLORS}
              icon={<FiTrendingUp />} iconColor="#10b981"
              editMode={editingGroup === "status"} onChange={(v) => setField("contactStatus", v)}
            />
            <EnumRow
              label="Contact Type"
              value={editingGroup === "status" ? draft.contactType : client?.contactType}
              map={CONTACT_TYPE_COLORS}
              icon={<FiUser />} iconColor="#6366f1"
              editMode={editingGroup === "status"} onChange={(v) => setField("contactType", v)}
            />
            <EnumRow
              label="Company Type"
              value={editingGroup === "status" ? draft.companyType : client?.companyType}
              map={COMPANY_TYPE_COLORS}
              icon={<FiBriefcase />} iconColor="#f59e0b"
              editMode={editingGroup === "status"} onChange={(v) => setField("companyType", v)}
            />
          </div>
        </GroupSection>

        {/* ===== Projection Status ===== */}
        <GroupSection
          title="Projection Status" icon={<FiDollarSign />}
          iconBg="linear-gradient(135deg,#facc15,#f97316)"
          groupKey="projection" isEditing={editingGroup === "projection"}
          onEdit={() => startEdit("projection")} onCancel={cancelEdit} onSave={saveEdit}
          saving={saving}
        >
          <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-2">
            <KV icon={<FiDollarSign />} iconColor="#10b981" label="Forecasted Amount"
                value={editingGroup === "projection" ? draft.forecastedAmount : client?.forecastedAmount}
                editMode={editingGroup === "projection"} onChange={(v) => setField("forecastedAmount", v)} />
            <KV icon={<FiTrendingUp />} iconColor="#0ea5e9" label="Interaction Count"
                value={editingGroup === "projection" ? draft.interactionCount : client?.interactionCount}
                editMode={editingGroup === "projection"} onChange={(v) => setField("interactionCount", v)} />
            <KV icon={<FiCalendar />} iconColor="#6366f1" label="Projected Close Date"
                value={editingGroup === "projection" ? draft.projectedCloseDate : client?.projectedCloseDate}
                editMode={editingGroup === "projection"} onChange={(v) => setField("projectedCloseDate", v)}
                inputProps={{ placeholder: "YYYY-MM-DD" }} />
            <KV icon={<FiFolder />} iconColor="#f97316" label="Folder Link"
                value={editingGroup === "projection" ? draft.folderLink : client?.folderLink}
                editMode={editingGroup === "projection"} onChange={(v) => setField("folderLink", v)} />
          </div>
        </GroupSection>

        {/* ===== Credit Card Information ===== */}
        <GroupSection
          title="Credit Card Information" icon={<FiCreditCard />}
          iconBg="linear-gradient(135deg,#5b7fff,#9349ff)"
          groupKey="credit" isEditing={editingGroup === "credit"}
          onEdit={() => startEdit("credit")} onCancel={cancelEdit} onSave={saveEdit}
          saving={saving}
        >
          <Box sx={{ mb: 2 }}>
            <CreditCardPreview
              number={editingGroup === "credit" ? draft.ccNumberText : ccNumberText}
              name={editingGroup === "credit" ? draft.nameOnCard : ccName}
              expiry={editingGroup === "credit" ? formatExpiry(draft.expirationDateText) : ccExpiry}
              cvc={editingGroup === "credit" ? draft.securityCodeText : ccCvc}
            />
          </Box>
          <div className="grid lg:grid-cols-2 2xl:grid-cols-3">
            <KV label="Name on Card" icon={<FiUser />} iconColor="#6366f1"
                value={editingGroup === "credit" ? draft.nameOnCard : ccName}
                editMode={editingGroup === "credit"} onChange={(v) => setField("nameOnCard", v)} />
            <KV label="CC Number Text" icon={<FiCreditCard />} iconColor="#0ea5e9"
                value={editingGroup === "credit" ? draft.ccNumberText : ccNumberText}
                editMode={editingGroup === "credit"} onChange={(v) => setField("ccNumberText", v)} />
            <KV label="Exp Date Text" icon={<FiCalendar />} iconColor="#10b981"
                value={editingGroup === "credit" ? draft.expirationDateText : ccExpiryRaw}
                editMode={editingGroup === "credit"} onChange={(v) => setField("expirationDateText", v)} />
            <KV label="Security Code Text" icon={<FiLock />} iconColor="#ef4444"
                value={editingGroup === "credit" ? draft.securityCodeText : ccCvc}
                editMode={editingGroup === "credit"} onChange={(v) => setField("securityCodeText", v)} />
            <KV label="Zip Code Text" icon={<FiMapPin />} iconColor="#facc15"
                value={editingGroup === "credit" ? draft.zipCodeText : ccZip}
                editMode={editingGroup === "credit"} onChange={(v) => setField("zipCodeText", v)} />
          </div>
        </GroupSection>

        {/* ===== Shipping Information ===== */}
        <GroupSection
          title="Shipping Information" icon={<FiTruck />}
          iconBg="linear-gradient(135deg,#3b82f6,#14b8a6)"
          groupKey="shipping" isEditing={editingGroup === "shipping"}
          onEdit={() => startEdit("shipping")} onCancel={cancelEdit} onSave={saveEdit}
          saving={saving}
        >
          <div className="flex gap-2">
            <EnumRow
              label="Default Shipping Term"
              value={editingGroup === "shipping" ? draft.defaultShippingTerms : client?.defaultShippingTerms}
              map={SHIPPING_COLORS} icon={<FiTruck />} iconColor="#3b82f6"
              editMode={editingGroup === "shipping"} onChange={(v) => setField("defaultShippingTerms", v)}
            />
            <EnumRow
              label="Default Payment Method"
              value={editingGroup === "shipping" ? draft.defaultPaymentMethod : client?.defaultPaymentMethod}
              map={PAYMENT_COLORS} icon={<FiCreditCard />} iconColor="#6366f1"
              editMode={editingGroup === "shipping"} onChange={(v) => setField("defaultPaymentMethod", v)}
            />
          </div>
        </GroupSection>

        {/* ===== Notes ===== */}
        {/* <GroupSection
          title="Notes" icon={<FiHash />}
          iconBg="linear-gradient(135deg,#6b7280,#111827)"
          groupKey="notes" isEditing={editingGroup === "notes"}
          onEdit={() => startEdit("notes")} onCancel={cancelEdit} onSave={saveEdit}
          saving={saving}
        >
          <KV icon={<FiHash />} iconColor="#6b7280" label="Last Note"
              value={editingGroup === "notes" ? draft.lastNote : client?.lastNote}
              editMode={editingGroup === "notes"} onChange={(v) => setField("lastNote", v)} />
        </GroupSection> */}
      </CardContent>
    </Card>
  );
}

/* Make a draft with only the group’s fields */
function makeDraft(c, group) {
  switch (group) {
    case "contact":
      return {
        phone: c?.phone || "",
        email: c?.email || "",
        address: c?.address || "",          // <-- matches schema
        website: c?.website || "",
        facebookPage: c?.facebookPage || "",
        industry: c?.industry || "",
      };
    case "status":
      return {
        description: c?.description || "",
        contactStatus: c?.contactStatus || "",
        contactType: c?.contactType || "",
        companyType: c?.companyType || "",
      };
    case "projection":
      return {
        forecastedAmount: c?.forecastedAmount ?? 0,
        interactionCount: c?.interactionCount ?? 0,
        projectedCloseDate: c?.projectedCloseDate || "",
        folderLink: c?.folderLink || "",
      };
    case "credit":
      return {
        nameOnCard: c?.nameOnCard || "",
        ccNumberText: c?.ccNumberText || "",
        expirationDateText: c?.expirationDateText || "",
        securityCodeText: c?.securityCodeText || "",
        zipCodeText: c?.zipCodeText || "",
      };
    case "shipping":
      return {
        defaultShippingTerms: c?.defaultShippingTerms || "",
        defaultPaymentMethod: c?.defaultPaymentMethod || "",
      };
    case "notes":
      return { lastNote: c?.lastNote || "" };
    default:
      return {};
  }
}
