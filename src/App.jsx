import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "./store/ui";
import { ToolbarProvider } from "./store/toolbar";
import Shell from "./components/layout/Shell";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import Activities from "./pages/Activities";
import "./App.css";

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
              <Route path="users" element={<Users />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="activities" element={<Activities />} />
            </Route>
          </Routes>
        </ToolbarProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
