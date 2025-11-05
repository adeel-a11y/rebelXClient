// src/pages/UserEditPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, useUpdateUser } from "../hooks/useUsers";
import { useToolbar } from "../store/toolbar";
import EditUser from "../components/update/EditUser";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id);
  const { mutateAsync, isPending: saving } = useUpdateUser();
  console.log("saving", saving)

  useToolbar({
    title: "Edit User",
    searchPlaceholder: "",
    actions: [{ label: "Back", variant: "ghost", onClick: () => navigate("/users") }],
    backButton: true,  
  });

  async function handleSubmit(payload) {
    await mutateAsync({ id, payload });
    navigate("/users");
  }

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
          />
        )}
      </div>
    </div>
  );
}
