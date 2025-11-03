import React from 'react'
import Orders from '../components/orders/Orders'
import { useParams } from 'react-router-dom'

const ClientOrdersPage = () => {

    const { id } = useParams();

    return (
        <>
            <Orders externalId={id} />
        </>
    )
}

export default ClientOrdersPage
