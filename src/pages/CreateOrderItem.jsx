import React from 'react'
import CreateOrEditOrderDetail from "../components/details/Orders/CreateOrEditOrderDetail";
import { useToolbar } from "../store/toolbar";
import { useNavigate } from "react-router-dom";

const CreateOrderItem = () => {

    const navigate = useNavigate();

    useToolbar({
        title: "Create Order Item",
        searchPlaceholder: "",
        backButton: true,
    });

    return (
        <>
            <CreateOrEditOrderDetail
                mode="create"
                onDone={() => /* toast + navigate */ null}
            />
        </>
    )
}

export default CreateOrderItem
