// src/components/details/client-details/ProfileSidebar/GroupSection.jsx
import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

export default function GroupSection({
  title,
  children,
  icon,
  iconBg,
  groupKey,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  showActions = true,
  saving = false,          // <-- NEW
}) {
  return (
    <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 2, p: 2, mb: 2, backgroundColor: "#fff", position: "relative" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, flexWrap: "wrap" }}>
        {icon ? (
          <Box sx={{ width: 28, height: 28, borderRadius: 2, fontSize: 16, display: "grid", placeItems: "center", fontWeight: 600, color: "#fff", background: iconBg || "linear-gradient(135deg,#5b7fff,#9349ff)" }}>
            {icon}
          </Box>
        ) : null}

        <Typography sx={{ fontWeight: 600, fontSize: ".9rem", color: "#111827", flex: 1 }}>
          {title}
        </Typography>

        {showActions && (
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <Tooltip title={`Edit ${title}`}>
                <span>
                  <IconButton size="small" onClick={onEdit} disabled={saving}>
                    <FiEdit2 />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="Cancel">
                  <span>
                    <IconButton size="small" onClick={onCancel} disabled={saving}>
                      <FiX />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title={saving ? "Saving…" : "Save"}>
                  <span>
                    <IconButton color="primary" size="small" onClick={onSave} disabled={saving}>
                      {saving ? <ClipLoader size={14} /> : <FiCheck />}
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
          </div>
        )}
      </Stack>

      {children}
    </Box>
  );
}
