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
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  RiDeleteBinLine,
  RiFileList2Line,
  RiMapPin2Line,
  RiMap2Line,
  RiMessage3Line,
  RiBarChart2Line,
  RiMore2Fill,
  RiCheckboxCircleFill,
  RiCloseCircleLine,
  RiDraftLine,
  RiTimeLine,
  RiSearchLine,
  RiEdit2Line,
} from "react-icons/ri";
import { useClient } from "../../hooks/useClients";
import { useParams } from "react-router-dom";

/* ---------------- data ---------------- */
const activities = [
  {
    _id: "68e0fe8da876ff6a254da1d5",
    trackingId: "42b91018",
    type: "Call",
    clientId: "6964fd5e",
    description: "NPU",
    createdAt: "9/30/2025 9:26:57",
    userId: "Isaiah Sanchez",
  },
  {
    _id: "68e0fe8da876ff6a254da1d6",
    trackingId: "A1B2C3",
    type: "Email",
    clientId: "6964fd5e",
    description: "Intro mail sent",
    createdAt: "10/01/2025 14:05:12",
    userId: "Jasmin Weber",
  },
  {
    _id: "68e0fe8da876ff6a254da1d7",
    trackingId: "777xyz",
    type: "Call",
    clientId: "6964fd5e",
    description: "Demo scheduled",
    createdAt: "10/02/2025 11:45:00",
    userId: "Crystal Harralo",
  },
  {
    _id: "68e0fe8da876ff6a254da1d8",
    trackingId: "777xyz",
    type: "Email",
    clientId: "6964fd5e",
    description: "Demo scheduled",
    createdAt: "10/02/2025 11:45:00",
    userId: "Crystal Harralo",
  },
  {
    _id: "68e0fe8da876ff6a254da1d9",
    trackingId: "777xyz",
    type: "Call",
    clientId: "6964fd5e",
    description: "Demo scheduled",
    createdAt: "10/02/2025 11:45:00",
    userId: "Crystal Harralo",
  },
  {
    _id: "68e0fe8da876ff6a254da1d10",
    trackingId: "777xyz",
    type: "Email",
    clientId: "6964fd5e",
    description: "Demo scheduled",
    createdAt: "10/02/2025 11:45:00",
    userId: "Crystal Harralo",
  },
  {
    _id: "68e0fe8da876ff6a254da1d11",
    trackingId: "777xyz",
    type: "Call",
    clientId: "6964fd5e",
    description: "Demo scheduled",
    createdAt: "10/02/2025 11:45:00",
    userId: "Crystal Harralo",
  },
  {
    _id: "68e0fe8da876ff6a254da1d12",
    trackingId: "777xyz",
    type: "Email",
    clientId: "6964fd5e",
    description: "Demo scheduled",
    createdAt: "10/02/2025 11:45:00",
    userId: "Crystal Harralo",
  },
];

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

/* ---------------- chips ---------------- */
function StatusChip({ value }) {
  const map = {
    Pending: {
      color: "#c28e16",
      icon: <RiTimeLine style={{ fontSize: 16 }} />,
      bg: "#fff6db",
      text: "Pending",
    },
    Done: {
      color: "#2faa48",
      icon: <RiCheckboxCircleFill style={{ fontSize: 16 }} />,
      bg: "#e8f9ed",
      text: "Done",
    },
    Draft: {
      color: "#8b93a1",
      icon: <RiDraftLine style={{ fontSize: 16 }} />,
      bg: "#eef1f5",
      text: "Draft",
    },
    Failed: {
      color: "#de5a78",
      icon: <RiCloseCircleLine style={{ fontSize: 16 }} />,
      bg: "#ffe4ea",
      text: "Failed",
    },
  };
  const s = map[value] || map.Pending;
  return (
    <Chip
      icon={s.icon}
      label={s.text}
      variant="filled"
      sx={{
        height: 26,
        borderRadius: 999,
        backgroundColor: s.bg,
        color: s.color,
        px: 0.5,
        ".MuiChip-icon": { color: s.color, ml: 0.5 },
        fontSize: 12,
      }}
    />
  );
}

/* ---------------- list row ---------------- */
function ActivityRow({ row }) {
  const dt = new Date(row.createdAt);
  const when = isNaN(dt.getTime())
    ? row.createdAt
    : `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.25 }}>
      {/* left icon box */}
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

      {/* Type */}
      <Box sx={{ width: 120, fontWeight: 600 }}>
        <Typography
          variant="body2"
          className={`${
            row?.type === "Call"
              ? "bg-green-100 inline-block rounded-xl px-3 py-1 text-green-500 border-green-200"
              : "bg-red-100 inline-block rounded-xl px-3 py-1 text-red-500 border-red-200"
          }`}
        >
          {row.type || "—"}
        </Typography>
      </Box>

      {/* Description (flex) */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap title={row.description}>
          {row.description || "—"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          #{row.trackingId}
        </Typography>
      </Box>

      {/* When */}
      <Box sx={{ width: 180 }}>
        <Typography variant="body2">{when}</Typography>
      </Box>

      {/* User */}
      <Box sx={{ width: 240 }}>
        <Typography variant="body2" noWrap title={row.userId}>
          {row.userId || "—"}
        </Typography>
      </Box>

      {/* Manage */}
      <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
        <IconButton size="small" aria-label="delete" color="error">
          <RiDeleteBinLine style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" aria-label="edit" color="">
          <RiEdit2Line style={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

/* ---------------- sidebar ---------------- */
function ProfileSidebar() {
  const { id } = useParams();

  const { data: client } = useClient(id);
  console.log("client", client)

  return (
    <Card sx={{ p: 2 }}>
      <Box
        sx={{
          height: 120,
          borderRadius: 2,
          background:
            "linear-gradient(135deg, rgba(255,96,96,1) 0%, rgba(108,123,255,1) 100%)",
          position: "relative",
          mb: 2,
        }}
      >
        <Avatar
          src="https://i.pravatar.cc/100?img=13"
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

      <Box sx={{ mt: 4 }}>
        <Typography fontWeight={700}>{client?.fullName || ""}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Email: {client?.email || "masdasd@gmail.com"} 
        </Typography>
        <Typography variant="body2">Phone: +998944232018</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<RiMessage3Line />}
            size="small"
          >
            Send message
          </Button>
          <Button
            variant="outlined"
            startIcon={<RiBarChart2Line />}
            size="small"
          >
            Analytics
          </Button>
          <IconButton size="small">
            <RiMore2Fill />
          </IconButton>
        </Stack>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
          Notes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We discussed about startups last time, she is more focused on XYZ; ask
          more questions, Lorem ipsum text here
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
          Address
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1901 Thornridge Cir. Shiloh, Hawaii 81063
        </Typography>

        <Card
          variant="outlined"
          sx={{ mt: 1.5, p: 1.5, borderRadius: 2, background: "#f8fafc" }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <RiMapPin2Line style={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ flex: 1 }}>
              View map
            </Typography>
            <IconButton size="small">
              <RiMap2Line style={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Card>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Typography variant="subtitle2">Attachments</Typography>
          <Button size="small">Add file</Button>
        </Stack>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {["Yearly report.pdf", "essay_english.docx"].map((f) => (
            <Card key={f} variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <RiFileList2Line style={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {f}
                </Typography>
                <RiMore2Fill style={{ fontSize: 16 }} />
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

/* ---------------- header ---------------- */
function HeaderBar() {
  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ md: "center" }}
      >
        <TextField
          placeholder="Search number or amount"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          SelectProps={{ native: true }}
          defaultValue="any"
          sx={{ minWidth: 180 }}
        >
          <option value="any">Any statuses</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="failed">Failed</option>
          <option value="draft">Draft</option>
        </TextField>
        <TextField
          select
          SelectProps={{ native: true }}
          defaultValue="this_month"
          sx={{ minWidth: 160 }}
        >
          <option value="this_month">This month</option>
          <option value="last_month">Last month</option>
          <option value="ytd">Year to date</option>
        </TextField>
      </Stack>

      <div className="grid grid-cols-3">
        <div className="">
          <Card sx={{ p: 2, background: "#e5e5e5" }}>
            <Typography variant="h6" fontWeight={800}>
              154
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Activities
            </Typography>
          </Card>
        </div>
        <div className="">
          <Card sx={{ p: 2, background: "#e7fbe8" }}>
            <Typography variant="h6" fontWeight={800} color="#2faa48">
              $980,721
            </Typography>
            <Typography variant="body2" color="#2faa48">
              Total Calls
            </Typography>
          </Card>
        </div>
        <div className="">
          <Card sx={{ p: 2, background: "#fff1d6" }}>
            <Typography variant="h6" fontWeight={800} color="#b77811">
              $1,980
            </Typography>
            <Typography variant="body2" color="#b77811">
              Total Emails
            </Typography>
          </Card>
        </div>
      </div>
    </Stack>
  );
}

/* ---------------- activity list ---------------- */
function ActivityList() {
  return (
    <Card sx={{ mt: 1.5 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 2.25, py: 1.75, borderBottom: "1px solid #eef1f4" }}>
          <Typography fontWeight={700}>Activities</Typography>
        </Box>

        {/* header */}
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
          <Box sx={{ width: 180 }}>When</Box>
          <Box sx={{ width: 220 }}>User</Box>
          <Box sx={{ width: 80, textAlign: "center" }}>Manage</Box>
        </Stack>

        <Box sx={{ px: 2.25 }}>
          {activities.map((row, idx) => (
            <React.Fragment key={row._id || idx}>
              <ActivityRow row={row} />
              {idx < activities.length - 1 && (
                <Divider sx={{ borderColor: "#f2f4f7" }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

/* ---------------- page ---------------- */
export default function ClientInvoicesPage() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        {/* FULL-WIDTH with no gutters */}
        <Container
          maxWidth={false}
          disableGutters
          sx={{ px: 2, py: 3, width: "100%" }}
        >
          <div className="flex xl:flex-row flex-col w-full gap-4">
            {/* LEFT (4/12) */}
            <div className="xl:w-[40%]">
              <ProfileSidebar />
            </div>

            {/* RIGHT (8/12) */}
            <div className="xl:w-[60%] w-full">
              <HeaderBar />
              <ActivityList />
            </div>
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
