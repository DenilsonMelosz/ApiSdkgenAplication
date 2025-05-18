import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/Login";
import { SignupPage } from "../pages/auth/Signup";
import { ProfilePage } from "../pages/Profile";
import { Home } from "../pages/Home";
import { Ajustes } from "../pages/Ajustes";
import { PrivateRoute } from "./privateRoute";
import { Unauthorized } from "../pages/Unauthorized";
import { Settings } from "../pages/Settings";



function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública para login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

       {/* Rotas protegidas */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/ajustes"
        element={
          <PrivateRoute>
            <Ajustes />
          </PrivateRoute>
        }
      />

      <Route
        path="/Settings"
        element={
            <PrivateRoute requiredRole="ADMIN">
            <Settings />
          </PrivateRoute>
        }
      />

      
      {/* Redireciona para não autorizado */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Redireciona para login por padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;