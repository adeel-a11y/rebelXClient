// src/pages/Clients.jsx
import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { useClients } from "../hooks/useClients";
import { useToolbar } from "../store/toolbar";

export default function Clients() {
  useToolbar({
    title: "Clients",
    searchPlaceholder: "Global: includes description, status, phone, addr",
    actions: [
      { label: "Import" },
      { label: "Export" },
      { label: "+ Add", variant: "primary" },
      { label: "Clear Data", variant: "danger" },
    ],
  });

  // MUI is 0-based; backend 1-based
  const [paginationModel, setPaginationModel] = useState({
    page: 0,         // 0 => page 1 on server
    pageSize: 20,    // fixed as requested
  });

  const pageForServer = paginationModel.page + 1;

  const { data, isLoading, isFetching } = useClients(pageForServer);
  console.log("data", data);

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
      { field: "contactStatus", headerName: "Status", width: 140 },
      { field: "city", headerName: "City", width: 130 },
      { field: "state", headerName: "State", width: 110 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
      { field: "phone", headerName: "Phone", width: 140 },
      { field: "website", headerName: "Website", flex: 1, minWidth: 180 },
      { field: "ownedBy", headerName: "Owner", width: 180 },
    ],
    []
  );

  // Tailwind-only card
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Clients</h2>

      {/* Initial load spinner (react-spinners) */}
      {isLoading && !data ? (
        <div className="flex items-center justify-center h-[60vh]">
          <ClipLoader size={42} />
        </div>
      ) : (
        <div className="h-[calc(100vh-220px)]">
          <DataGrid
            columns={columns}
            rows={data?.rows ?? []}
            getRowId={(row) => row._id}
            loading={isFetching} // grid's built-in overlay during background fetch
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              // lock pageSize to 20
              setPaginationModel({ page: model.page, pageSize: 20 });
            }}
            pageSizeOptions={[20]}
            paginationMode="server"
            rowCount={data?.meta?.total ?? 0}
            density="standard"
            sx={{
              // Minimal MUI styling; still Tailwind wrapper outside
              border: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
