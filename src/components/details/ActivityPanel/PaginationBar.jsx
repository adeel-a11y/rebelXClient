// src/components/details/client-details/ActivityPanel/PaginationBar.jsx
import { Box, Button, Stack, Typography } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function PaginationBar({
  page,
  perPage,
  total,
  totalPages,
  onChange,
}) {
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
              <Box
                key={`dots-${i}`}
                sx={{ px: 0.5, color: "text.secondary" }}
              >
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
