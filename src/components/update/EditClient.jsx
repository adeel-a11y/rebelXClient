// src/pages/ClientEdit.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientCreate from "../create/ClientCreate";
import { useClient, useUpdateClient } from "../../hooks/useClients";
import { ClipLoader } from "react-spinners";
import { useToolbar } from "../../store/toolbar";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: loading } = useClient(id);
  const { mutateAsync, isPending } = useUpdateClient(id);

  useToolbar({
    title: "Edit Client",
    searchPlaceholder: "",
    onSearch: () => {},
    actions: [],
  });

  const handleSubmit = async (payload) => {
    try {
      await mutateAsync(payload);
      navigate("/clients", { replace: true });
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || e.message || "Failed to update client");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <ClipLoader size={42} />
      </div>
    );
    }

  if (!data?._id) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
          Client not found.
        </div>
      </div>
    );
  }

  return (
    <ClientCreate
      mode="edit"
      initial={data}
      submitting={isPending}
      onSubmit={handleSubmit}
    />
  );
}
