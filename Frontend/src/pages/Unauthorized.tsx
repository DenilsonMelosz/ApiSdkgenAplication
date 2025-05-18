import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Unauthorized() {
      const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <AlertTriangle className="w-24 h-24 text-red-600 mb-4" />
      <h1 className="text-3xl font-bold text-red-600">Acesso Negado</h1>
      <p className="text-gray-700 mt-4">Você não tem permissão para acessar esta página.</p>
        <button
        onClick={() => navigate("/home")}
        className="mt-6 px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-green-500 transition"
      >
        Voltar para Home
      </button>
    </div>
  );
}
