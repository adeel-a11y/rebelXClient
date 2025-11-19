// src/pages/ClientNew.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientCreate from "../components/create/ClientCreate";
import { useCreateClient } from "../hooks/useClients";
import { useToolbar } from "../store/toolbar";
import ToastNotification from "../components/ToastNotification";

// These must be present in payload before creating a client
const REQUIRED_FIELDS = [
  "name",
  "fullName",       // Owned By (user name)
  "contactStatus",
  "contactType",
  "companyType",
  "phone",
  "email",
  "address",
  "city",
  "state",
  "postalCode",
];

export default function ClientCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateClient();
  const [toast, setToast] = useState(null);

  useToolbar({
    title: "New Client",
    searchPlaceholder: "",
    onSearch: () => {},
    actions: [],
    backButton: true,
  });

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  const handleSubmit = async (payload) => {
    // ---------- Frontend required field validation ----------
    const missing = REQUIRED_FIELDS.filter((key) => {
      const v = payload[key];
      return !v || (typeof v === "string" && v.trim() === "");
    });

    if (missing.length) {
      showToast(
        "error",
        "Missing required fields",
        "Please fill all fields marked with * before saving the client."
      );
      return;
    }

    try {
      const created = await mutateAsync(payload);

      showToast(
        "success",
        "Client created",
        `${created?.name || "Client"} has been added successfully.`
      );

      // Small delay so user can see toast; portal will usually survive route change
      setTimeout(() => {
        navigate("/clients", { replace: true });
      }, 600);
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e.message ||
        "Failed to create client.";

      showToast("error", "Failed to create client", msg);
    }
  };

  return (
    <>
      <ClientCreate
        mode="create"
        submitting={isPending}
        onSubmit={handleSubmit}
      />

      <ToastNotification
        open={!!toast}
        type={toast?.type}
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </>
  );
}
