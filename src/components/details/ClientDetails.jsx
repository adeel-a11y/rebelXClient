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
import { useNavigate, useParams } from "react-router-dom";
import { useClient, useActivitiesByClient } from "../../hooks/useClients";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDebouncedValue } from "../../utils/useDebounceValue";

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

function Badge({ value, map }) {
  if (!value) return null;
  const c = map[value] || { bg: "#eef2f7", fg: "#475569" };
  return (
    <Chip
      label={value}
      sx={{
        height: 26,
        borderRadius: 999,
        bgcolor: c.bg,
        color: c.fg,
        fontWeight: 700,
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    />
  );
}

function KV({ label, value, link }) {
  const body = link ? (
    <Link href={link} target="_blank" rel="noreferrer" underline="hover">
      {dash(value)}
    </Link>
  ) : (
    dash(value)
  );
  return (
    <Stack spacing={0.25}>
      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", fontSize: ".8rem" }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {body}
      </Typography>
    </Stack>
  );
}

function Section({ title, children, mt = 2 }) {
  return (
    <Box sx={{ mt }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.75, color: "text.secondary" }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function fmtAddress(c) {
  const parts = [c?.address, c?.city, c?.state, c?.postalCode].filter(Boolean);
  return parts.join(", ");
}
function gmapsLink(addr) {
  return addr
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        addr
      )}`
    : null;
}

/* ---------------- dynamic LEFT sidebar ---------------- */
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

  const fullName = client?.fullName || client?.name || "—";
  const addr = fmtAddress(client);
  const avatarSrc =
    client?.profileImage ||
    `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`;

  return (
    <Card sx={{ p: 2 }}>
      {/* banner + avatar */}
      <Box
        sx={{
          height: 120,
          borderRadius: 2,
          background: "linear-gradient(135deg,#ff6060 0%,#6c7bff 100%)",
          position: "relative",
          mb: 2,
        }}
      >
        <Avatar
          src={avatarSrc}
          sx={{
            width: 60,
            height: 60,
            border: "3px solid #fff",
            position: "absolute",
            left: 14,
            bottom: -24,
          }}
        />
      </Box>

      {/* name + quick actions */}
      <Box sx={{ mt: 4 }}>
        <Typography fontWeight={700}>{fullName}</Typography>

        {/* ===== Identity / External ===== */}
        <Section title="Identity">
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <KV label="External ID" value={client?.externalId} />
            </Grid>
            <Grid item xs={12}>
              <KV label="Owned By (email)" value={client?.ownedBy} />
            </Grid>
          </Grid>
        </Section>

        <Section title="Creation Date">
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <KV label="Created At" value={fmtDate(client?.createdAt)} />
            </Grid>
            <Grid item xs={12}>
              <KV
                label="Projected Close Date"
                value={fmtDate(client?.projectedCloseDate)}
              />
            </Grid>
          </Grid>
        </Section>

        {/* ===== Enums as colorful badges ===== */}
        <Section title="Status & Types">
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            <Badge value={client?.contactStatus} map={STATUS_COLORS} />
            <Badge value={client?.contactType} map={CONTACT_TYPE_COLORS} />
            <Badge value={client?.companyType} map={COMPANY_TYPE_COLORS} />
          </Stack>
        </Section>

        <Section title="Defaults">
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            <Badge value={client?.defaultShippingTerms} map={SHIPPING_COLORS} />
            <Badge value={client?.defaultPaymentMethod} map={PAYMENT_COLORS} />
          </Stack>
        </Section>

        {/* ===== Contact ===== */}
        <Section title="Contact">
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <KV
                label="Email"
                value={client?.email}
                link={client?.email ? `mailto:${client.email}` : undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <KV
                label="Phone"
                value={client?.phone}
                link={client?.phone ? `tel:${client.phone}` : undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <KV label="Full Name" value={client?.fullName} />
            </Grid>
          </Grid>
        </Section>

        {/* ===== Address ===== */}
        <Section title="Address">
          <Typography variant="body2" color="text.secondary">
            {addr || "—"}
          </Typography>
        </Section>

        {/* ===== Online presence ===== */}
        <Section title="Online">
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <KV
                label="Website"
                value={client?.website}
                link={client?.website || undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <KV
                label="Facebook"
                value={client?.facebookPage}
                link={client?.facebookPage || undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <KV
                label="Folder Link"
                value={client?.folderLink}
                link={client?.folderLink || undefined}
              />
            </Grid>
          </Grid>
        </Section>

        {/* ===== Business ===== */}
        <Section title="Business">
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <KV label="Industry" value={client?.industry} />
            </Grid>
            <Grid item xs={6}>
              <KV label="Forecasted Amount" value={client?.forecastedAmount} />
            </Grid>
            <Grid item xs={6}>
              <KV label="Interaction Count" value={client?.interactionCount} />
            </Grid>
          </Grid>
        </Section>

        {/* ===== Notes / Description ===== */}
        <Section title="Description">
          <Typography variant="body2" color="text.secondary">
            {dash(client?.description)}
          </Typography>
        </Section>

        <Section title="Last Note">
          <Typography variant="body2" color="text.secondary">
            {dash(client?.lastNote)}
          </Typography>
        </Section>

        {/* ===== Legacy Payment Text (non-PCI) ===== */}
        <Section title="Legacy Payment (non-PCI text)">
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <KV label="Name on Card" value={client?.nameOnCard} />
            </Grid>
            <Grid item xs={6}>
              <KV
                label="Expiration Date Text"
                value={client?.expirationDateText}
              />
            </Grid>
            <Grid item xs={6}>
              <KV label="CC Number Text" value={client?.ccNumberText} />
            </Grid>
            <Grid item xs={6}>
              <KV label="Security Code Text" value={client?.securityCodeText} />
            </Grid>
            <Grid item xs={6}>
              <KV label="Zip Code Text" value={client?.zipCodeText} />
            </Grid>
          </Grid>
        </Section>
      </Box>
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

/* ---------------- right pane activity list ---------------- */
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
        {/* <Typography variant="caption" color="text.secondary">
          #{row.trackingId}
        </Typography> */}
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

/* ---------------- sticky, Gmail-style paginator ---------------- */
function PaginationBar({ page, perPage, total, totalPages, onChange }) {
  const start = total ? (page - 1) * perPage + 1 : 0;
  const end = Math.min(page * perPage, total);

  // build compact page buttons (windowed with ellipses)
  const pages = [];
  const window = 1; // neighbors on each side
  const push = (p) => pages.push(p);

  if (totalPages <= 7) {
    for (let p = 1; p <= totalPages; p++) push(p);
  } else {
    // first block
    push(1);
    if (page > 3) pages.push("…");
    // middle window
    for (
      let p = Math.max(2, page - window);
      p <= Math.min(totalPages - 1, page + window);
      p++
    ) {
      push(p);
    }
    if (page < totalPages - 2) pages.push("…");
    // last
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
        {/* Header */}
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

        {/* Column labels */}
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

        {/* Rows */}
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

        {/* Sticky paginator (bottom of card) */}
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

/* ---------------- page ---------------- */
export default function ClientDetails() {
  const { id } = useParams();

  // Local search & pagination state (shared by header + list)
  const [q, setQ] = React.useState("");
  const debouncedQ = useDebouncedValue(q, 400); // debounce to avoid spamming API
  const [page, setPage] = React.useState(1);

  // Reset to page 1 whenever the search changes
  React.useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  // Fetch counts & top summary using the debounced search, so cards reflect filtered set too
  const { data, isFetching } = useActivitiesByClient(id, page, 50, debouncedQ);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: theme.palette.background.default, minHeight: "100vh" }}>
        <Container maxWidth={false} disableGutters sx={{ px: 2, py: 3, width: "100%" }}>
          <div className="flex xl:flex-row flex-col w-full gap-4">
            <div className="xl:w-[40%]">
              <ProfileSidebar />
            </div>

            <div className="xl:w-[60%] w-full">
              <HeaderBar counts={data?.counts} q={q} onChange={setQ} />
              <ActivityList page={page} setPage={setPage} q={debouncedQ} />
            </div>
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
