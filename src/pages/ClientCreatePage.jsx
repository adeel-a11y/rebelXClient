// src/pages/ClientNew.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ClientCreate from "../components/create/ClientCreate";
import { useCreateClient } from "../hooks/useClients";
import { useToolbar } from "../store/toolbar";

export default function ClientCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateClient();

  useToolbar({
    title: "New Client",
    searchPlaceholder: "",
    onSearch: () => {},
    actions: [],
    backButton: true,
  });

  const handleSubmit = async (payload) => {
    try {
      const created = await mutateAsync(payload);
      // go detail or list; for now go to Clients list
      navigate("/clients", { replace: true });
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || e.message || "Failed to create client");
    }
  };

  return (
    <ClientCreate
      mode="create"
      submitting={isPending}
      onSubmit={handleSubmit}
    />
  );
}
