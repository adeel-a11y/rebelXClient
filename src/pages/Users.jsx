// src/pages/Users.jsx
import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { useUsers } from "../hooks/useUsers";
import { useToolbar } from "../store/toolbar";

export default function Users() {
  useToolbar({
    title: "Users",
    searchPlaceholder: "Search users…",
    actions: [
      { label: "Import" },
      { label: "Export" },
      { label: "+ Add", variant: "primary" },
      { label: "Clear Data", variant: "danger" },
    ],
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI 0-based
    pageSize: 20, // fixed
  });

  const pageForServer = paginationModel.page + 1;
  const { data, isLoading, isFetching } = useUsers(pageForServer);

  // Users.jsx (columns)
  const dash = (v) => (v === undefined || v === null || v === "" ? "—" : v);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      // v6: (value, row)
      valueFormatter: (value, row) => {
        const full =
          value ||
          [row?.firstName, row?.lastName].filter(Boolean).join(" ") ||
          row?.username;
        return dash(full);
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
      valueFormatter: (value) => dash(value),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      valueFormatter: (value) => dash(value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      valueFormatter: (value) => dash(value),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      valueFormatter: (value) => dash(value),
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Users</h2>

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
            loading={isFetching}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={
              (model) => setPaginationModel({ page: model.page, pageSize: 20 }) // lock to 20
            }
            pageSizeOptions={[20]}
            paginationMode="server"
            rowCount={data?.meta?.total ?? 0}
            density="standard"
            sx={{ border: "none" }}
          />
        </div>
      )}
    </div>
  );
}
