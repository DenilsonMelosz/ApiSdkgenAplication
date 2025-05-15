import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/Login";
import { SignupPage } from "../pages/auth/Signup";
import { ProfilePage } from "../pages/Profile";
import { Home } from "../pages/Home";
import { Ajustes } from "../pages/Ajustes";
import { PrivateRoute } from "./privateRoute";

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

      {/* Redireciona para login por padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;