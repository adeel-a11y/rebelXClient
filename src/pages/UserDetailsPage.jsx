import React from "react";
import UserDetails from "../components/details/UserDetails";
import { useToolbar } from "../store/toolbar";
import { useNavigate } from "react-router-dom";

const UserDetailsPage = () => {
  const navigate = useNavigate();

  useToolbar({
    title: "User Details",
    searchPlaceholder: "",
    actions: [
      { label: "Back", variant: "ghost", onClick: () => navigate("/users") },
    ],
    backButton: true,
  });

  return (
    <>
      <UserDetails />
    </>
  );
};

export default UserDetailsPage;
