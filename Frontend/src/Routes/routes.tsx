import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/Login";
import { SignupPage } from "../pages/auth/Signup";
import { ProfilePage } from "../pages/Profile";
import { PrivateRoute } from "./privateRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública para login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Rota protegida para o perfil */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Redireciona para login por padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;