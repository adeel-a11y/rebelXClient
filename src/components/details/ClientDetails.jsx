// src/components/details/ClientDetails.jsx
import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";

import {
  RiDeleteBinLine,
  RiFileList2Line,
  RiSearchLine,
  RiEdit2Line,
} from "react-icons/ri";

import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiFacebook,
  FiUser,
  FiHash,
  FiCalendar,
  FiBriefcase,
  FiDollarSign,
  FiTrendingUp,
  FiFolder,
  FiCreditCard,
  FiTruck,
  FiLock,
} from "react-icons/fi";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { useNavigate, useParams } from "react-router-dom";
import { useClient, useActivitiesByClient } from "../../hooks/useClients";
import { useDebouncedValue } from "../../utils/useDebounceValue";

/* NEW: credit card preview */
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

/* ---------------- theme ---------------- */
const theme = createTheme({
  palette: {
    background: { default: "#fafafa" },
    success: { main: "#34c759" },
    warning: { main: "#f4c74b" },
    error: { main: "#f38ba0" },
    primary: { main: "#5b7fff" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 14, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 999 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: { root: { background: "#fff" } },
    },
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
  },
});

/* ---------------- enum color maps (badges) ---------------- */
const STATUS_COLORS = {
  Sampling: { bg: "#e3f9f0", fg: "#036857" },
  "New Prospect": { bg: "#e8f0ff", fg: "#123fa8" },
  Uncategorized: { bg: "#eef2f6", fg: "#475569" },
  "Closed lost": { bg: "#ffe6ea", fg: "#b0123b" },
  "Initial Contact": { bg: "#fff2e0", fg: "#9a4a00" },
  "Closed won": { bg: "#e6fbef", fg: "#04684d" },
  Committed: { bg: "#f2e9ff", fg: "#6320c1" },
  Consideration: { bg: "#fff7cf", fg: "#8a5900" },
  Other: { bg: "#f1f5f9", fg: "#334155" },
};

const PAYMENT_COLORS = {
  "Credit Card": { bg: "#e7f1ff", fg: "#1742a1" },
  "CC#": { bg: "#f4e9ff", fg: "#6b21a8" },
  "Auth Payment Link": { bg: "#e6fdff", fg: "#0f6170" },
  "Mobile Check Deposit": { bg: "#fff5cc", fg: "#7a4b00" },
  ACH: { bg: "#e6fbf1", fg: "#0b6b4c" },
  Cash: { bg: "#fff0e1", fg: "#9a3f00" },
  "Nothing Due": { bg: "#eef2f6", fg: "#475569" },
  "Check By Mail": { bg: "#fff1db", fg: "#8a4a00" },
  "Net Terms": { bg: "#dff2ff", fg: "#075985" },
  Other: { bg: "#f2f4f7", fg: "#334155" },
};

const SHIPPING_COLORS = {
  "UPS Ground": { bg: "#e6efff", fg: "#1a43a6" },
  "UPS 2nd Day Air": { bg: "#e3f7ff", fg: "#055d7a" },
  "UPS 3 Day Select": { bg: "#ecebff", fg: "#4338ca" },
  "UPS Next Day Air Saver": { bg: "#f3ecff", fg: "#6d28d9" },
  "USPS Ground Advantage": { bg: "#e6fbf0", fg: "#065f46" },
  "Will Call": { bg: "#fff4e6", fg: "#9a4f00" },
  "Local Delivery": { bg: "#fff9d6", fg: "#8a5a00" },
  "Freight Via SAIA": { bg: "#e0f3ff", fg: "#075985" },
};

const COMPANY_TYPE_COLORS = {
  "Smoke Shop": { bg: "#e6f8ff", fg: "#075b83" },
  "Vape Store": { bg: "#efe7ff", fg: "#5e2aa5" },
  Shop: { bg: "#e6fcef", fg: "#0b6b4b" },
  Distro: { bg: "#fff7cf", fg: "#855700" },
  "Master Distro": { bg: "#e8f0ff", fg: "#163da1" },
  "Broker/Jobber": { bg: "#e3fbf2", fg: "#0a6a55" },
  Manufacturer: { bg: "#fff0e1", fg: "#9a3f00" },
  Dispensary: { bg: "#fff0bf", fg: "#7a4a00" },
  "Kratom Dispensary": { bg: "#f3e9ff", fg: "#6b21a8" },
  "Kratom Dispensary/Distributor": { bg: "#ecebff", fg: "#3730a3" },
  "CBD Dispensary": { bg: "#e6fdff", fg: "#0e5e71" },
  "Kava/Kratom Bar": { bg: "#e0f2ff", fg: "#075985" },
  "Kava Bar": { bg: "#e0e7ff", fg: "#3940a3" },
  "Health Food Store": { bg: "#e6fbf0", fg: "#0b6b4b" },
  "Tobacco Shop": { bg: "#eef3f8", fg: "#334155" },
  "Liquor store": { bg: "#ffe6ea", fg: "#b1123b" },
  "Online Retailer": { bg: "#dff0ff", fg: "#0f3b7a" },
  Franchise: { bg: "#fff7d6", fg: "#8a5a00" },
  Spa: { bg: "#efe7ff", fg: "#6b28a8" },
  Individual: { bg: "#e6f0ff", fg: "#1a40a6" },
  "Beer and Wine Bar": { bg: "#e8fbea", fg: "#166534" },
  Market: { bg: "#e6fdff", fg: "#155e75" },
  "Amherst Client": { bg: "#f4e9ff", fg: "#6d28d9" },
  "Sully's Client": { bg: "#e0f2ff", fg: "#075985" },
  "Whole Saler": { bg: "#e8edf3", fg: "#334155" },
  "Gas station": { bg: "#fff2df", fg: "#9a4f00" },
  "Vape Empire": { bg: "#e3e6ff", fg: "#3730a3" },
  Other: { bg: "#f1f5f9", fg: "#334155" },
};

const CONTACT_TYPE_COLORS = {
  "Potential Customer": { bg: "#e6f0ff", fg: "#1a40a6" },
  "Current Customer": { bg: "#ecfdf3", fg: "#0b6b46" },
  "Inactive Customer": { bg: "#ffe6ea", fg: "#b0123b" },
  Uncategorized: { bg: "#eef2f6", fg: "#475569" },
  Other: { bg: "#f2f4f7", fg: "#334155" },
};

/* ---------------- utility ---------------- */
const dash = (v) =>
  v === null || v === undefined || v === "" ? "—" : String(v);
const fmtDate = (v) => (v ? new Date(v).toLocaleString() : "—");

/* UPDATED: KV now supports an icon */
function KV({ icon, iconColor = "#6b7280", label, value, link }) {
  const body = link ? (
    <Link href={link} target="_blank" rel="noreferrer" underline="hover">
      {dash(value)}
    </Link>
  ) : (
    dash(value)
  );

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      sx={{ mb: 1.25, lineHeight: 1.2 }}
    >
      {icon ? (
        <Box
          sx={{
            mt: "2px",
            color: iconColor,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      ) : null}

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: "text.secondary", fontSize: ".75rem" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ wordBreak: "break-word", fontWeight: 500 }}
        >
          {body}
        </Typography>
      </Stack>
    </Stack>
  );
}

/* Section block w/ headline like in screenshot 2 */
function GroupSection({ title, children, icon, iconBg }) {
  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        p: 2,
        mb: 2,
        backgroundColor: "#fff",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 1.5, flexWrap: "wrap" }}
      >
        {icon ? (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 2,
              fontSize: 16,
              display: "grid",
              placeItems: "center",
              fontWeight: 600,
              color: "#fff",
              background: iconBg || "linear-gradient(135deg,#5b7fff,#9349ff)",
            }}
          >
            {icon}
          </Box>
        ) : null}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: ".9rem",
            color: "#111827",
          }}
        >
          {title}
        </Typography>
      </Stack>

      {children}
    </Box>
  );
}

/* tiny helper to render colorful Badge chips for enums */
function EnumRow({ label, value, map, icon, iconColor }) {
  if (!value)
    return (
      <KV
        label={label}
        value="—"
        icon={icon}
        iconColor={iconColor || "#6b7280"}
      />
    );

  const c = map[value] || { bg: "#eef2f7", fg: "#475569" };
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ mb: 1.25 }}
      alignItems="flex-start"
    >
      <Stack spacing={0.25} sx={{ flex: 1 }}>
        <div className="flex space-x-2 pb-2">
          {icon ? (
            <Box
              sx={{
                mt: "2px",
                color: iconColor || c.fg,
                fontSize: 16,
                // flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          ) : null}

          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", fontSize: ".75rem" }}
          >
            {label}
          </Typography>
        </div>
        <div className="w-full flex px-1">
          <Chip
            size="small"
            label={value}
            sx={{
              fontWeight: 600,
              borderRadius: 999,
              bgcolor: c.bg,
              color: c.fg,
              border: "1px solid rgba(0,0,0,0.04)",
              width: "100%",
            }}
          />
        </div>
      </Stack>
    </Stack>
  );
}

/* helper to generate Google Maps link */
function gmapsLink(fullAddr) {
  return fullAddr
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        fullAddr
      )}`
    : null;
}

/* format full address string */
function fullAddressFromClient(c) {
  // address, city, state, postalCode
  const parts = [c?.address, c?.city, c?.state, c?.postalCode].filter(Boolean);
  return parts.join(", ");
}

// turn "729" -> "07/29", "1225" -> "12/25"
function formatExpiry(raw) {
  if (!raw) return "";

  const digits = String(raw).replace(/\D/g, ""); // keep only numbers

  if (digits.length === 3) {
    // e.g. "729" => "7" + "29"
    const mm = digits[0]; // "7"
    const yy = digits.slice(1); // "29"
    // pad month to 2 digits -> "07"
    return `${mm.padStart(2, "0")}/${yy}`;
  }

  if (digits.length === 4) {
    // e.g. "1225" => "12" + "25"
    const mm = digits.slice(0, 2); // "12"
    const yy = digits.slice(2); // "25"
    return `${mm}/${yy}`;
  }

  // fallback: maybe it's already "07/29" or something weird
  return raw;
}

/* CREDIT CARD PREVIEW BLOCK
   shows 2 cards side-by-side:
   - left card (front, focus number)
   - right card (back, focus cvc)
*/
function CreditCardPreview({ number, name, expiry, cvc }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        my: 3,
      }}
    >
      {/* FLIP CONTAINER */}
      <Box
        sx={{
          perspective: "1000px",
          width: 280,
          height: 170,
          cursor: "pointer",

          // when hovered, rotate the inner wrapper
          "&:hover .flipInner": {
            transform: "rotateY(180deg)",
          },
        }}
      >
        {/* INNER WRAPPER THAT ROTATES */}
        <Box
          className="flipInner"
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
          }}
        >
          {/* FRONT SIDE */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden", // hide when rotated
              WebkitBackfaceVisibility: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotateY(0deg)",
            }}
          >
            <Cards
              number={dash(number)}
              name={dash(name)}
              expiry={dash(expiry)}
              cvc={dash(cvc)}
              focused={"number"} // shows front layout
            />
          </Box>

          {/* BACK SIDE */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              // rotate this side so it's visible after flip
              transform: "rotateY(180deg)",
            }}
          >
            <Cards
              number={dash(number)}
              name={dash(name)}
              expiry={dash(expiry)}
              cvc={dash(cvc)}
              focused={"cvc"} // this makes react-credit-cards-2 render the back with the CVC
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------------- LEFT SIDEBAR (UPDATED LAYOUT) ---------------- */
function ProfileSidebar() {
  const { id } = useParams();
  const { data: client, isLoading, isError, error } = useClient(id);

  if (isLoading) {
    return (
      <Card sx={{ p: 2 }}>
        <Box
          sx={{
            height: 120,
            borderRadius: 2,
            background: "linear-gradient(135deg,#ff6060 0%,#6c7bff 100%)",
            mb: 2,
          }}
        />
        <Stack spacing={1.2} sx={{ mt: 2 }}>
          <Box
            sx={{ width: 160, height: 22, bgcolor: "#eee", borderRadius: 1 }}
          />
          <Box
            sx={{ width: 220, height: 18, bgcolor: "#eee", borderRadius: 1 }}
          />
          <Box
            sx={{ width: 180, height: 18, bgcolor: "#eee", borderRadius: 1 }}
          />
        </Stack>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography color="error">Failed to load client.</Typography>
        <Typography variant="body2" color="text.secondary">
          {String(error?.message || "")}
        </Typography>
      </Card>
    );
  }

  // pull fields from API response (your JSON screenshot)
  const shopName = client?.name || "—"; // Good Mood Smoke Shop
  const contactName = client?.fullName || "—"; // Sam Bukhari
  const createdAt = fmtDate(client?.createdAt);

  const fullAddr = fullAddressFromClient(client);

  // credit card values (non-PCI text)
  const ccName = client?.nameOnCard;
  const ccNumberText = client?.ccNumberText;
  const ccExpiryRaw = client?.expirationDateText;
  const ccExpiry = formatExpiry(ccExpiryRaw); // <-- formatted "MM/YY"
  const ccCvc = client?.securityCodeText;
  const ccZip = client?.zipCodeText;

  return (
    <Card sx={{ p: 0, overflow: "hidden" }}>
      {/* Top banner with avatar */}
      <Box
        sx={{
          position: "relative",
          height: 120,
          background:
            "linear-gradient(135deg,#ff6060 0%,#6c7bff 50%,#5b7fff 100%)",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Avatar
          src={
            client?.profileImage ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          sx={{
            width: 64,
            height: 64,
            border: "3px solid #fff",
            position: "absolute",
            left: 16,
            bottom: -24,
            boxShadow: "0 4px 10px rgba(0,0,0,.15)",
            backgroundColor: "#fff",
          }}
        />
      </Box>

      <CardContent sx={{ pt: 4 }}>
        {/* Header: Client name, contact name, created at */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{ fontWeight: 700, color: "#111827", fontSize: "1rem" }}
          >
            {shopName}
          </Typography>
          <Typography
            sx={{
              fontSize: ".85rem",
              color: "#4b5563",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px",
              mt: 0.5,
            }}
          >
            <FiUser style={{ color: "#6366f1" }} />
            {contactName}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: ".75rem",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
          >
            <FiCalendar style={{ color: "#3b82f6" }} />
            Created At {createdAt}
          </Typography>
        </Box>

        {/* ---------------- CONTACT INFORMATION ---------------- */}
        <GroupSection
          title="Contact Information"
          icon={<FiPhone />}
          iconBg="linear-gradient(135deg,#3b82f6,#6366f1)"
        >
          <KV
            icon={<FiPhone />}
            iconColor="#10b981"
            label="Phone"
            value={client?.phone}
            link={client?.phone ? `tel:${client.phone}` : undefined}
          />
          <KV
            icon={<FiMail />}
            iconColor="#6366f1"
            label="Email"
            value={client?.email}
            link={client?.email ? `mailto:${client.email}` : undefined}
          />
          <KV
            icon={<FiMapPin />}
            iconColor="#ef4444"
            label="Address"
            value={fullAddr}
            link={gmapsLink(fullAddr) || undefined}
          />
          <KV
            icon={<FiGlobe />}
            iconColor="#0ea5e9"
            label="Website"
            value={client?.website}
            link={client?.website || undefined}
          />
          <KV
            icon={<FiFacebook />}
            iconColor="#3b5998"
            label="Facebook Page"
            value={client?.facebookPage}
            link={client?.facebookPage || undefined}
          />
          <KV
            icon={<FiBriefcase />}
            iconColor="#14b8a6"
            label="Industry"
            value={client?.industry}
          />
        </GroupSection>

        {/* ---------------- CLIENT STATUS ---------------- */}
        <GroupSection
          title="Client Status"
          icon={<FiTrendingUp />}
          iconBg="linear-gradient(135deg,#14b8a6,#10b981)"
        >
          <KV
            icon={<FiHash />}
            iconColor="#6366f1"
            label="Description"
            value={client?.description}
          />

          <div className="flex">
            <div className="w-full">
              <EnumRow
                label="Contact Status"
                value={client?.contactStatus}
                map={STATUS_COLORS}
                icon={<FiTrendingUp />}
                iconColor="#10b981"
              />
            </div>

            <div className="w-full">
              <EnumRow
                label="Contact Type"
                value={client?.contactType}
                map={CONTACT_TYPE_COLORS}
                icon={<FiUser />}
                iconColor="#6366f1"
              />
            </div>

            <div className="w-full">
              <EnumRow
                label="Company Type"
                value={client?.companyType}
                map={COMPANY_TYPE_COLORS}
                icon={<FiBriefcase />}
                iconColor="#f59e0b"
              />
            </div>
          </div>
        </GroupSection>

        {/* ---------------- PROJECTION STATUS ---------------- */}
        <GroupSection
          title="Projection Status"
          icon={<FiDollarSign />}
          iconBg="linear-gradient(135deg,#facc15,#f97316)"
        >
          <KV
            icon={<FiDollarSign />}
            iconColor="#10b981"
            label="Forecasted Amount"
            value={client?.forecastedAmount}
          />
          <KV
            icon={<FiTrendingUp />}
            iconColor="#0ea5e9"
            label="Interaction Count"
            value={client?.interactionCount}
          />
          <KV
            icon={<FiCalendar />}
            iconColor="#6366f1"
            label="Projected Close Date"
            value={fmtDate(client?.projectedCloseDate)}
          />
          <KV
            icon={<FiFolder />}
            iconColor="#f97316"
            label="Folder Link"
            value={client?.folderLink}
            link={client?.folderLink || undefined}
          />
        </GroupSection>

        {/* ---------------- CREDIT CARD INFORMATION ---------------- */}
        <GroupSection
          title="Credit Card Information"
          icon={<FiCreditCard />}
          iconBg="linear-gradient(135deg,#5b7fff,#9349ff)"
        >
          {/* The pretty card previews */}
          <Box sx={{ mb: 2 }}>
            <CreditCardPreview
              number={ccNumberText}
              name={ccName}
              expiry={ccExpiry}
              cvc={ccCvc}
            />
          </Box>

          {/* Raw fields below cards */}
          <KV
            icon={<FiUser />}
            iconColor="#6366f1"
            label="Name on Card"
            value={ccName}
          />
          <KV
            icon={<FiCreditCard />}
            iconColor="#0ea5e9"
            label="CC Number Text"
            value={ccNumberText}
          />
          <KV
            icon={<FiCalendar />}
            iconColor="#10b981"
            label="Exp Date Text"
            value={ccExpiry}
          />
          <KV
            icon={<FiLock />}
            iconColor="#ef4444"
            label="Security Code Text"
            value={ccCvc}
          />
          <KV
            icon={<FiMapPin />}
            iconColor="#facc15"
            label="Zip Code Text"
            value={ccZip}
          />
        </GroupSection>

        {/* ---------------- SHIPPING INFORMATION ---------------- */}
        <GroupSection
          title="Shipping Information"
          icon={<FiTruck />}
          iconBg="linear-gradient(135deg,#3b82f6,#14b8a6)"
        >
          <div className="flex">
            <div className="w-full">
              <EnumRow
                label="Default Shipping Term"
                value={client?.defaultShippingTerms}
                map={SHIPPING_COLORS}
                icon={<FiTruck />}
                iconColor="#3b82f6"
              />
            </div>

            <div className="w-full">
              <EnumRow
                label="Default Payment Method"
                value={client?.defaultPaymentMethod}
                map={PAYMENT_COLORS}
                icon={<FiCreditCard />}
                iconColor="#6366f1"
              />
            </div>
          </div>
        </GroupSection>

        {/* ---------------- NOTES ---------------- */}
        <GroupSection
          title="Notes"
          icon={<FiHash />}
          iconBg="linear-gradient(135deg,#6b7280,#111827)"
        >
          <KV
            icon={<FiHash />}
            iconColor="#6b7280"
            label="Last Note"
            value={client?.lastNote}
          />
        </GroupSection>
      </CardContent>
    </Card>
  );
}

/* ---------------- right pane header ---------------- */
function HeaderBar({ counts, q, onChange }) {
  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ md: "center" }}
      >
        <TextField
          placeholder="Search Activity (name, type, tracking #, etc.)"
          fullWidth
          value={q}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <div className="grid lg:grid-cols-2 2xl:grid-cols-4">
        <div>
          <Card sx={{ p: 2, background: "#e5e5e5" }}>
            <Typography variant="h6" fontWeight={800}>
              {counts?.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Activities
            </Typography>
          </Card>
        </div>
        <div>
          <Card sx={{ p: 2, background: "#e7fbe8" }}>
            <Typography variant="h6" fontWeight={800} color="#2faa48">
              {counts?.calls || 0}
            </Typography>
            <Typography variant="body2" color="#2faa48">
              Total Calls
            </Typography>
          </Card>
        </div>
        <div>
          <Card sx={{ p: 2, background: "#fff4f5" }}>
            <Typography variant="h6" fontWeight={800} color="#f43940">
              {counts?.emails || 0}
            </Typography>
            <Typography variant="body2" color="#f43940">
              Total Emails
            </Typography>
          </Card>
        </div>
        <div>
          <Card sx={{ p: 2, background: "#e5ecf9" }}>
            <Typography variant="h6" fontWeight={800} color="#2563EB">
              {counts?.others || 0}
            </Typography>
            <Typography variant="body2" color="#2563EB">
              Others
            </Typography>
          </Card>
        </div>
      </div>
    </Stack>
  );
}

/* ---------------- right pane activity row/list/pagination ---------------- */
function ActivityRow({ row }) {
  const dt = new Date(row.createdAt);
  const when = isNaN(dt.getTime())
    ? row.createdAt
    : `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

  const isCall = String(row?.type || "").toLowerCase() === "call";
  const isEmail = String(row?.type || "").toLowerCase() === "email";

  const navigate = useNavigate();

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.25 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1,
          border: "1px solid #e5e7eb",
          display: "grid",
          placeItems: "center",
          color: "#6b7280",
          flex: "0 0 28px",
        }}
      >
        <RiFileList2Line style={{ fontSize: 16 }} />
      </Box>

      <Box sx={{ width: 120, fontWeight: 600 }}>
        <Typography
          variant="body2"
          className={`${
            isCall
              ? "bg-green-100 inline-block rounded-xl px-3 py-1 text-green-600 border-green-200"
              : isEmail
              ? "bg-red-100 inline-block rounded-xl px-3 py-1 text-red-500 border-red-200"
              : "bg-blue-100 inline-block rounded-xl px-3 py-1 text-blue-600 border-blue-200"
          }`}
        >
          {row.type || "—"}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap title={row.description}>
          {row.description || "—"}
        </Typography>
      </Box>

      <Box sx={{ width: 180 }}>
        <Typography variant="body2">{when}</Typography>
      </Box>

      <Box sx={{ width: 240 }}>
        <Typography variant="body2" noWrap title={row.userId}>
          {row.userId || "—"}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
        <IconButton
          onClick={() => handleDelete(row._id)}
          size="small"
          aria-label="delete"
          color="error"
        >
          <RiDeleteBinLine style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          onClick={() => navigate(`/activities/${row._id}`)}
          size="small"
          aria-label="edit"
        >
          <RiEdit2Line style={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function PaginationBar({ page, perPage, total, totalPages, onChange }) {
  const start = total ? (page - 1) * perPage + 1 : 0;
  const end = Math.min(page * perPage, total);

  const pages = [];
  const window = 1;
  const push = (p) => pages.push(p);

  if (totalPages <= 7) {
    for (let p = 1; p <= totalPages; p++) push(p);
  } else {
    push(1);
    if (page > 3) pages.push("…");
    for (
      let p = Math.max(2, page - window);
      p <= Math.min(totalPages - 1, page + window);
      p++
    ) {
      push(p);
    }
    if (page < totalPages - 2) pages.push("…");
    push(totalPages);
  }

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        bgcolor: "#fff",
        borderTop: "1px solid #eef1f4",
        px: 2,
        py: 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Typography variant="caption" color="text.secondary">
          {`${start}-${end} of ${total || 0}`}
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="center">
          <Button
            size="small"
            variant="text"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
          >
            <IoIosArrowBack />
          </Button>

          {pages.map((p, i) =>
            p === "…" ? (
              <Box key={`dots-${i}`} sx={{ px: 0.5, color: "text.secondary" }}>
                …
              </Box>
            ) : (
              <Button
                key={p}
                size="small"
                onClick={() => onChange(p)}
                variant={p === page ? "contained" : "text"}
                sx={{
                  minWidth: 32,
                  borderRadius: 999,
                  ...(p === page ? { fontWeight: 700 } : {}),
                }}
              >
                {p}
              </Button>
            )
          )}

          <Button
            size="small"
            variant="text"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
          >
            <IoIosArrowForward />
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Page: {page}
        </Typography>
      </Stack>
    </Box>
  );
}

function ActivityList({ page, setPage, q }) {
  const { id } = useParams();
  const perPage = 50;

  const { data, isLoading, isFetching } = useActivitiesByClient(
    id,
    page,
    perPage,
    q
  );

  const rows = data?.data ?? [];
  const total = Number(data?.total || 0);
  const totalPages = Number(
    data?.totalPages || Math.max(Math.ceil(total / perPage), 1)
  );

  return (
    <Card
      sx={{
        mt: 1.5,
        display: "flex",
        flexDirection: "column",
        maxHeight: "70vh",
        overflowY: "scroll",
      }}
    >
      <CardContent
        sx={{ p: 0, display: "flex", flexDirection: "column", flex: 1 }}
      >
        <Box sx={{ px: 2.25, py: 1.75, borderBottom: "1px solid #eef1f4" }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Typography fontWeight={700}>Activities</Typography>
            {isFetching && (
              <Typography variant="caption" color="text.secondary">
                updating…
              </Typography>
            )}
          </Stack>
        </Box>

        <Stack
          direction="row"
          sx={{
            py: 1,
            px: 2.25,
            color: "#6b7280",
            fontSize: 12,
            borderBottom: "1px solid #f1f5f9",
          }}
          spacing={2}
        >
          <Box sx={{ width: 28 }} />
          <Box sx={{ width: 120 }}>Type</Box>
          <Box sx={{ flex: 1 }}>Description</Box>
          <Box sx={{ width: 180 }}>Date</Box>
          <Box sx={{ width: 220 }}>User</Box>
          <Box sx={{ width: 80, textAlign: "center" }}>Manage</Box>
        </Stack>

        <Box sx={{ px: 2.25, overflowY: "auto", flex: 1 }}>
          {isLoading ? (
            <Box sx={{ p: 2, color: "text.secondary" }}>
              Loading activities…
            </Box>
          ) : rows.length === 0 ? (
            <Box sx={{ p: 2, color: "text.secondary" }}>
              No activities found.
            </Box>
          ) : (
            rows.map((row, idx) => (
              <React.Fragment key={row._id || `${row.trackingId}-${idx}`}>
                <ActivityRow row={row} />
                {idx < rows.length - 1 && (
                  <Divider sx={{ borderColor: "#f2f4f7" }} />
                )}
              </React.Fragment>
            ))
          )}
        </Box>

        <PaginationBar
          page={data?.page || page}
          perPage={data?.perPage || perPage}
          total={total}
          totalPages={totalPages}
          onChange={(p) => setPage(p)}
        />
      </CardContent>
    </Card>
  );
}

/* ---------------- full page ---------------- */
export default function ClientDetails() {
  const { id } = useParams();

  // Local search & pagination state (shared by header + list)
  const [q, setQ] = React.useState("");
  const debouncedQ = useDebouncedValue(q, 400);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  const { data, isFetching } = useActivitiesByClient(id, page, 50, debouncedQ);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ px: 2, py: 3, width: "100%" }}
        >
          <div className="flex xl:flex-row flex-col w-full gap-4">
            <div className="xl:w-[45%]">
              <ProfileSidebar />
            </div>

            <div className="xl:w-[55%] w-full">
              <HeaderBar
                counts={data?.counts}
                q={q}
                onChange={setQ}
                isFetching={isFetching}
              />
              <ActivityList page={page} setPage={setPage} q={debouncedQ} />
            </div>
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
