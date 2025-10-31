import React from 'react'
import CreateOrEditOrder from "../components/orders/CreateOrEditOrder";
import { useToolbar } from "../store/toolbar";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {

    const navigate = useNavigate();

    useToolbar({
        title: "Create Order",
        searchPlaceholder: "",
        backButton: true,
    });

    return (
        <>
            <CreateOrEditOrder
                mode="create"
                onDone={() => /* toast + navigate */ null}
            />
        </>
    )
}

export default CreateOrder
