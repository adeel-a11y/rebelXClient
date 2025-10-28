// src/components/details/client-details/ActivityPanel/ActivityRow.jsx
import { Box, Stack, Typography, IconButton } from "@mui/material";
import { RiFileList2Line, RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoMdCall } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";

function handleDelete(id) {
  // TODO: hook up delete logic
  console.log("delete", id);
}

export default function ActivityRow({ row }) {
  const dt = new Date(row.createdAt);
  const when = isNaN(dt.getTime())
    ? row.createdAt
    : `${dt.toLocaleDateString()}`;

  const isCall = String(row?.type || "").toLowerCase() === "call";
  const isEmail = String(row?.type || "").toLowerCase() === "email";

  const navigate = useNavigate();

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.25 }}>
      <Box sx={{ width: "5%", fontWeight: 600 }}>
        <Typography
          variant="body2"
          className={`${
            isCall
              ? "inline-block rounded-xl text-green-600 border-green-200"
              : isEmail
              ? "inline-block rounded-xl text-red-500 border-red-200"
              : "inline-block rounded-xl text-blue-600 border-blue-200"
          }`}
        >
          {row.type === "call" || row.type === "Call" ? <IoMdCall /> : row.type === "email" || row.type === "Email" ? <MdOutlineMail /> : <TiDocumentText /> || "—"}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, width: "70%" }}>
        <Typography variant="body2" noWrap title={row.description}>
          {row.description || "—"}
        </Typography>
      </Box>

      <Box sx={{ width: "10%" }}>
        <Typography variant="body2">{when}</Typography>
      </Box>

      <Box sx={{ width: "10%" }}>
        <Typography variant="body2" noWrap title={row.userId}>
          {row.userId || "—"}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.5} sx={{ ml: 1, width: "5%" }}>
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
