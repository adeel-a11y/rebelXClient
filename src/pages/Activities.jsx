import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { useActivities } from "../hooks/useActivities";
import { useToolbar } from "../store/toolbar";

const dash = (v) => (v === undefined || v === null || v === "" ? "—" : v);
const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? dash(v) : d.toLocaleString();
};

export default function Activities() {
  useToolbar({
    title: "Activities",
    searchPlaceholder: "Search metrics…",
  });

  // MUI is 0-based; server is 1-based
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const pageForServer = paginationModel.page + 1;

  const { data, isLoading, isFetching } = useActivities(pageForServer);

  // ⚠️ MUI X v6: valueGetter(value, row), valueFormatter(value, row)
  const columns = useMemo(
    () => [
      {
        field: "createdAt",
        headerName: "Date/Time",
        width: 190,
        valueGetter: (_v, row) => row?.createdAt || row?.created_at || row?.date || null,
        valueFormatter: (v) => fmtDate(v),
      },
      { field: "type", headerName: "Type", width: 120, valueFormatter: (v) => dash(v) },
      { field: "trackingId", headerName: "Tracking ID", width: 160, valueFormatter: (v) => dash(v) },
      { field: "clientId", headerName: "Client ID", width: 130, valueFormatter: (v) => dash(v) },
      { field: "userId", headerName: "User", width: 200, valueFormatter: (v) => dash(v) },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 260,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "createdAt",
        headerName: "Date/Time",
        width: 190,
        valueGetter: (_v, row) => row?.createdAt || row?.created_at || row?.date || null,
        valueFormatter: (v) => fmtDate(v),
      },
    ],
    []
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Activities</h2>

      {isLoading && !data ? (
        <div className="flex items-center justify-center h-[60vh]">
          <ClipLoader size={42} />
        </div>
      ) : (
        <div className="h-[calc(100vh-220px)]">
          <DataGrid
            rows={data?.rows ?? []}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isFetching}
            disableRowSelectionOnClick
            paginationMode="server"
            rowCount={data?.meta?.total ?? 0}
            paginationModel={paginationModel}
            onPaginationModelChange={(m) => setPaginationModel({ page: m.page, pageSize: 20 })}
            pageSizeOptions={[20]}
            sx={{ border: "none" }}
          />
        </div>
      )}
    </div>
  );
}
