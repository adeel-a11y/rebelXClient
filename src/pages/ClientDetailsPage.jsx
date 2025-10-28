import React from "react";
import ClientDetails from "../components/details/ClientDetails/ClientDetails";
import { useToolbar } from "../store/toolbar";

const ClientDetailsPage = () => {
  useToolbar({
    title: "Clients Details",
    search: null,
    actions: [],
    backButton: true,  
  });

  return (
    <>
      <ClientDetails />
    </>
  );
};

export default ClientDetailsPage;
