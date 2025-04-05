import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const logado = localStorage.getItem("user");

  return logado ? <>{children}</> : <Navigate to="/" replace />;
}
