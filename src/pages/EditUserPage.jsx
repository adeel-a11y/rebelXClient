// src/pages/UserEditPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, useUpdateUser } from "../hooks/useUsers";
import { useToolbar } from "../store/toolbar";
import EditUser from "../components/update/EditUser";
import ToastNotification from "../components/ToastNotification";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id);
  const { mutateAsync, isPending: saving } = useUpdateUser();
  const [toast, setToast] = useState(null);

  useToolbar({
    title: "Edit User",
    searchPlaceholder: "",
    actions: [
      {
        label: "Back",
        variant: "ghost",
        onClick: () => navigate("/users"),
      },
    ],
    backButton: true,
  });

  async function handleSubmit(payload) {
    try {
      await mutateAsync({ id, payload });
      setToast({
        type: "success",
        title: "User updated",
        message: "Changes have been saved successfully.",
      });
      setTimeout(() => navigate("/users"), 600);
    } catch (err) {
      setToast({
        type: "error",
        title: "Failed to save user",
        message:
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong while saving.",
      });
    }
  }

  const handleValidationError = (message) => {
    setToast({
      type: "error",
      title: "Please check the form",
      message,
    });
  };

  return (
    <div className="mx-auto">
      <div className="edit_user_form">
        {isLoading ? (
          <div className="text-slate-500">Loading…</div>
        ) : (
          <EditUser
            mode="edit"
            initial={user}
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/users")}
            onValidationError={handleValidationError}
          />
        )}
      </div>

      <ToastNotification
        open={!!toast}
        type={toast?.type}
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
