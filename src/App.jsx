import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "./store/ui";
import { ToolbarProvider } from "./store/toolbar";
import Shell from "./components/layout/Shell";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import Activities from "./pages/Activities";
import UserCreatePage from "./pages/UsersCreatePage";
import EditUserPage from "./pages/EditUserPage";
import EditClient from "./components/update/EditClient";
import ClientCreatePage from "./pages/ClientCreatePage";
import UserDetails from "./components/details/UserDetails";
import "./App.css";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import ActivityUpsert from "./components/create/ActivityUpsert";
import ClientActivitiesPage from "./pages/ClientActivitiesPage";
import OrdersPage from "./pages/OrdersPage";
import CreateOrder from "./pages/CreateOrder";
import EditOrderPage from "./pages/EditOrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ClientOrdersPage from "./pages/ClientOrderPage";
import CreateOrderItem from "./pages/CreateOrderItem";
import EditOrderItem from "./pages/EditOrderItem";

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <ToolbarProvider>
          <Routes>
            <Route element={<Shell />}>
              {" "}
              {/* shell wraps all pages */}
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="/clients/new" element={<ClientCreatePage />} />
              <Route path="/clients/:id" element={<EditClient />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<UserCreatePage />} />
              <Route path="/users/:id" element={<EditUserPage />} />
              <Route path="/user-details/:id" element={<UserDetails />} />
              <Route path="activities" element={<Activities />} />
              <Route path="client-activities/:id" element={<ClientActivitiesPage />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/client-orders/:id" element={<ClientOrdersPage />} />
              <Route path="/orders/new" element={<CreateOrder />} />
              <Route path="/orders/:id" element={<EditOrderPage />} />
              <Route path="/order-details/:id" element={<OrderDetailPage />} />
              <Route path="/create-order-item/:orderId" element={<CreateOrderItem />} />
              <Route path="/edit-order-item/:orderId/:id" element={<EditOrderItem />} />
              <Route
                path="/client-details/:id/:externalId"
                element={<ClientDetailsPage />}
              />
              <Route path="/activities/new" element={<ActivityUpsert />} />
              <Route path="/activities/:id" element={<ActivityUpsert />} />
            </Route>
          </Routes>
        </ToolbarProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
