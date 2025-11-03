// src/components/details/client-details/ProfileSidebar/ProfileSidebar.jsx
import * as React from "react";
import {
  Avatar, Box, Card, CardContent, Stack, Typography,
} from "@mui/material";
import {
  FiPhone, FiMail, FiMapPin, FiGlobe, FiFacebook, FiUser,
  FiHash, FiCalendar, FiBriefcase, FiDollarSign, FiTrendingUp,
  FiFolder, FiCreditCard, FiTruck, FiLock,
} from "react-icons/fi";

import { useParams } from "react-router-dom";
import { useClient, useUpdateClient } from "../../../hooks/useClients"; // <-- ensure this exists
import {
  STATUS_COLORS, PAYMENT_COLORS, SHIPPING_COLORS, COMPANY_TYPE_COLORS,
  CONTACT_TYPE_COLORS, fmtDate, fullAddressFromClient, gmapsLink, formatExpiry,
} from "../ClientDetails/helpers";

import KV from "./KV";
import GroupSection from "./GroupSection";
import EnumRow from "./EnumRow";
import CreditCardPreview from "./CreditCardPreview";
import EditFieldDialog from "./EditFieldDialog";

export default function ProfileSidebar() {
  const { id } = useParams();
  const { data: client, isLoading, isError, error } = useClient(id);
  const { mutateAsync: updateClient, isLoading: saving } = useUpdateClient?.() || { mutateAsync: async () => {} };

  const [dlg, setDlg] = React.useState({
    open: false, key: "", label: "", value: "", type: "text", options: []
  });

  const openEditor = (key, label, value, opts = {}) => {
    setDlg({ open: true, key, label, value: value ?? "", type: opts.type || "text", options: opts.options || [] });
  };
  const closeEditor = () => setDlg((s) => ({ ...s, open: false }));

  const saveField = async (val) => {
    // Adjust payload to your API shape:
    // e.g. updateClient({ id, data: { [dlg.key]: val } })
    try {
      await updateClient?.({ id, data: { [dlg.key]: val } });
    } catch (e) {
      console.error("Update failed:", e);
    } finally {
      closeEditor();
    }
  };

  if (isLoading) {
    return (
      <Card sx={{ p: 2 }}>
        <Box sx={{ height: 120, borderRadius: 2, background: "linear-gradient(135deg,#ff6060 0%,#6c7bff 100%)", mb: 2 }} />
        <Stack spacing={1.2} sx={{ mt: 2 }}>
          <Box sx={{ width: 160, height: 22, bgcolor: "#eee", borderRadius: 1 }} />
          <Box sx={{ width: 220, height: 18, bgcolor: "#eee", borderRadius: 1 }} />
          <Box sx={{ width: 180, height: 18, bgcolor: "#eee", borderRadius: 1 }} />
        </Stack>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography color="error">Failed to load client.</Typography>
        <Typography variant="body2" color="text.secondary">{String(error?.message || "")}</Typography>
      </Card>
    );
  }

  const shopName = client?.name || "—";
  const contactName = client?.fullName || "—";
  const createdAt = fmtDate(client?.createdAt);
  const fullAddr = fullAddressFromClient(client);

  // credit card values
  const ccName = client?.nameOnCard;
  const ccNumberText = client?.ccNumberText;
  const ccExpiryRaw = client?.expirationDateText;
  const ccExpiry = formatExpiry(ccExpiryRaw);
  const ccCvc = client?.securityCodeText;
  const ccZip = client?.zipCodeText;

  return (
    <>
      <Card sx={{ p: 0, overflow: "hidden" }}>
        {/* Banner */}
        <Box sx={{ position: "relative", height: 120,
          background: "linear-gradient(135deg,#ff6060 0%,#6c7bff 50%,#5b7fff 100%)" }}>
          <Avatar
            src={client?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            sx={{
              width: 64, height: 64, border: "3px solid #fff",
              position: "absolute", left: 16, bottom: -24, boxShadow: "0 4px 10px rgba(0,0,0,.15)",
              backgroundColor: "#fff",
            }}
          />
        </Box>

        <CardContent sx={{ pt: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "1rem" }}>{shopName}</Typography>
            <Typography sx={{ fontSize: ".85rem", color: "#4b5563", fontWeight: 500, display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", mt: 0.5 }}>
              <FiUser style={{ color: "#6366f1" }} />
              {contactName}
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: ".75rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
              <FiCalendar style={{ color: "#3b82f6" }} />
              Created At {createdAt}
            </Typography>
          </Box>

          {/* Contact Information */}
          <GroupSection title="Contact Information" icon={<FiPhone />} iconBg="linear-gradient(135deg,#3b82f6,#6366f1)">
            <div className="grid grid-cols-1 xl:grid-cols-2">
              <KV
                isContactInfo icon={<FiPhone />} iconColor="#10b981"
                label="Phone" value={client?.phone}
                link={client?.phone ? `tel:${client.phone}` : undefined}
                editable onEdit={() => openEditor("phone", "Phone", client?.phone)}
              />
              <KV
                isContactInfo icon={<FiMail />} iconColor="#6366f1"
                label="Email" value={client?.email}
                link={client?.email ? `mailto:${client.email}` : undefined}
                editable onEdit={() => openEditor("email", "Email", client?.email)}
              />
              <KV
                isContactInfo icon={<FiMapPin />} iconColor="#ef4444"
                label="Address" value={fullAddr}
                link={gmapsLink(fullAddr) || undefined}
                editable onEdit={() => openEditor("address", "Address", fullAddr)}
              />
              <KV
                isContactInfo icon={<FiGlobe />} iconColor="#0ea5e9"
                label="Website" value={client?.website}
                link={client?.website || undefined}
                editable onEdit={() => openEditor("website", "Website", client?.website)}
              />
              <KV
                isContactInfo icon={<FiFacebook />} iconColor="#3b5998"
                label="Facebook Page" value={client?.facebookPage}
                link={client?.facebookPage || undefined}
                editable onEdit={() => openEditor("facebookPage", "Facebook Page", client?.facebookPage)}
              />
              <KV
                isContactInfo icon={<FiBriefcase />} iconColor="#14b8a6"
                label="Industry" value={client?.industry}
                editable onEdit={() => openEditor("industry", "Industry", client?.industry)}
              />
            </div>
          </GroupSection>

          {/* Client Status */}
          <GroupSection title="Client Status" icon={<FiTrendingUp />} iconBg="linear-gradient(135deg,#14b8a6,#10b981)">
            <KV
              icon={<FiHash />} iconColor="#6366f1"
              label="Description" value={client?.description}
              editable onEdit={() => openEditor("description", "Description", client?.description)}
            />

            <div className="grid lg:grid-cols-2 2xl:grid-cols-3">
              <div className="w-full">
                <EnumRow
                  label="Contact Status" value={client?.contactStatus}
                  map={STATUS_COLORS} icon={<FiTrendingUp />} iconColor="#10b981"
                  editable onEdit={() =>
                    openEditor("contactStatus", "Contact Status", client?.contactStatus,
                      { type: "select", options: Object.keys(STATUS_COLORS) })}
                />
              </div>
              <div className="w-full">
                <EnumRow
                  label="Contact Type" value={client?.contactType}
                  map={CONTACT_TYPE_COLORS} icon={<FiUser />} iconColor="#6366f1"
                  editable onEdit={() =>
                    openEditor("contactType", "Contact Type", client?.contactType,
                      { type: "select", options: Object.keys(CONTACT_TYPE_COLORS) })}
                />
              </div>
              <div className="w-full">
                <EnumRow
                  label="Company Type" value={client?.companyType}
                  map={COMPANY_TYPE_COLORS} icon={<FiBriefcase />} iconColor="#f59e0b"
                  editable onEdit={() =>
                    openEditor("companyType", "Company Type", client?.companyType,
                      { type: "select", options: Object.keys(COMPANY_TYPE_COLORS) })}
                />
              </div>
            </div>
          </GroupSection>

          {/* Projection Status */}
          <GroupSection title="Projection Status" icon={<FiDollarSign />} iconBg="linear-gradient(135deg,#facc15,#f97316)">
            <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-2">
              <KV icon={<FiDollarSign />} iconColor="#10b981"
                  label="Forecasted Amount" value={client?.forecastedAmount}
                  editable onEdit={() => openEditor("forecastedAmount", "Forecasted Amount", client?.forecastedAmount)} />
              <KV icon={<FiTrendingUp />} iconColor="#0ea5e9"
                  label="Interaction Count" value={client?.interactionCount}
                  editable onEdit={() => openEditor("interactionCount", "Interaction Count", client?.interactionCount)} />
              <KV icon={<FiCalendar />} iconColor="#6366f1"
                  label="Projected Close Date" value={fmtDate(client?.projectedCloseDate)}
                  editable onEdit={() => openEditor("projectedCloseDate", "Projected Close Date", client?.projectedCloseDate)} />
              <KV icon={<FiFolder />} iconColor="#f97316"
                  label="Folder Link" value={client?.folderLink} link={client?.folderLink || undefined}
                  editable onEdit={() => openEditor("folderLink", "Folder Link", client?.folderLink)} />
            </div>
          </GroupSection>

          {/* Credit Card Info */}
          <GroupSection title="Credit Card Information" icon={<FiCreditCard />} iconBg="linear-gradient(135deg,#5b7fff,#9349ff)">
            <Box sx={{ mb: 2 }}>
              <CreditCardPreview number={ccNumberText} name={ccName} expiry={ccExpiry} cvc={ccCvc} />
            </Box>
            <div className="grid lg:grid-cols-2 2xl:grid-cols-3">
              <KV icon={<FiUser />} iconColor="#6366f1" label="Name on Card" value={ccName}
                  editable onEdit={() => openEditor("nameOnCard", "Name on Card", ccName)} />
              <KV icon={<FiCreditCard />} iconColor="#0ea5e9" label="CC Number Text" value={ccNumberText}
                  editable onEdit={() => openEditor("ccNumberText", "CC Number Text", ccNumberText)} />
              <KV icon={<FiCalendar />} iconColor="#10b981" label="Exp Date Text" value={ccExpiryRaw}
                  editable onEdit={() => openEditor("expirationDateText", "Exp Date", ccExpiryRaw)} />
              <KV icon={<FiLock />} iconColor="#ef4444" label="Security Code Text" value={ccCvc}
                  editable onEdit={() => openEditor("securityCodeText", "Security Code", ccCvc)} />
              <KV icon={<FiMapPin />} iconColor="#facc15" label="Zip Code Text" value={ccZip}
                  editable onEdit={() => openEditor("zipCodeText", "Zip Code", ccZip)} />
            </div>
          </GroupSection>

          {/* Shipping Info */}
          <GroupSection title="Shipping Information" icon={<FiTruck />} iconBg="linear-gradient(135deg,#3b82f6,#14b8a6)">
            <div className="flex gap-2">
              <div className="w-full">
                <EnumRow
                  label="Default Shipping Term" value={client?.defaultShippingTerms}
                  map={SHIPPING_COLORS} icon={<FiTruck />} iconColor="#3b82f6"
                  editable onEdit={() =>
                    openEditor("defaultShippingTerms", "Default Shipping Term", client?.defaultShippingTerms,
                      { type: "select", options: Object.keys(SHIPPING_COLORS) })}
                />
              </div>
              <div className="w-full">
                <EnumRow
                  label="Default Payment Method" value={client?.defaultPaymentMethod}
                  map={PAYMENT_COLORS} icon={<FiCreditCard />} iconColor="#6366f1"
                  editable onEdit={() =>
                    openEditor("defaultPaymentMethod", "Default Payment Method", client?.defaultPaymentMethod,
                      { type: "select", options: Object.keys(PAYMENT_COLORS) })}
                />
              </div>
            </div>
          </GroupSection>

          {/* Notes */}
          <GroupSection title="Notes" icon={<FiHash />} iconBg="linear-gradient(135deg,#6b7280,#111827)">
            <KV icon={<FiHash />} iconColor="#6b7280"
                label="Last Note" value={client?.lastNote}
                editable onEdit={() => openEditor("lastNote", "Last Note", client?.lastNote)} />
          </GroupSection>
        </CardContent>
      </Card>

      {/* One dialog for all edits */}
      <EditFieldDialog
        open={dlg.open}
        label={dlg.label}
        value={dlg.value}
        type={dlg.type}
        options={dlg.options}
        onClose={closeEditor}
        onSave={saveField}
      />
    </>
  );
}
