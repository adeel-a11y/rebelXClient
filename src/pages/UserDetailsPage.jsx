import React from "react";
import UserDetails from "../components/details/UserDetails";
import { useToolbar } from "../store/toolbar";
import { useNavigate } from "react-router-dom";

const UserDetailsPage = () => {
 

  return (
    <>
      <UserDetails />
    </>
  );
};

export default UserDetailsPage;
