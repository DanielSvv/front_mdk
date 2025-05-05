import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ChargesPage } from "./pages/ChargesPage";
import { LoginPage } from "./pages/LoginPage";
import { AuthGuard } from "./components/auth/AuthGuard";
import { UserHomePage } from "./pages/user/UserHomePage";
import { PublicAuthPage } from "./pages/PublicAuthPage";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          {/* Página pública de login/cadastro */}
          <Route path="/" element={<PublicAuthPage />} />
          {/* Página do usuário (mobile) */}
          <Route path="/user" element={<UserHomePage />} />
          {/* Login do admin */}
          <Route path="/admin" element={<LoginPage />} />
          {/* Rotas protegidas */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                <AppLayout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/charges" element={<ChargesPage />} />
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </AppLayout>
              </AuthGuard>
            }
          />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
