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
              <Route path="tasks" element={<Tasks />} />
              <Route path="activities" element={<Activities />} />
              <Route path="/users/new" element={<UserCreatePage />} />
              <Route path="/users/:id" element={<EditUserPage />} />
              <Route path="/user-details/:id" element={<UserDetails />} />
              <Route path="/client-details/:id" element={<ClientDetailsPage />} />
            </Route>
          </Routes>
        </ToolbarProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
