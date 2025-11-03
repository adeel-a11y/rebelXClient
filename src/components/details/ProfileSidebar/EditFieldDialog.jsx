// src/components/details/client-details/ProfileSidebar/EditFieldDialog.jsx
import * as React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem
} from "@mui/material";

export default function EditFieldDialog({
  open, onClose, label = "Edit",
  value: initial = "", type = "text",
  options = [], onSave
}) {
  const [val, setVal] = React.useState(initial ?? "");

  React.useEffect(() => setVal(initial ?? ""), [initial, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{label}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {type === "select" ? (
          <TextField
            select fullWidth value={val}
            onChange={(e) => setVal(e.target.value)}
            label={label}
          >
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth value={val} onChange={(e) => setVal(e.target.value)}
            label={label}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave?.(val)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
