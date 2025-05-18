import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/nav-bar";

export function Settings() {
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("user");

    if (!userJson) {
      navigate("/");
      return;
    }

    try {
      const user = JSON.parse(userJson);
      if (user.role !== "ADMIN") {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Erro ao analisar os dados do usuário:", error);
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <NavBar title="Admin" showHomeIcon={true} showBackButton={true} backUrl="/home"  />
      
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <section className="mx-auto max-w-4xl space-y-8">
          <div className="p-12 text-center ">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Role do ADMIN</h1>
            <p className="text-red-500">
              Esta página é acessível apenas para <strong>ADMINISTRADORES.</strong>
            </p>
            <p className="text-red-500">Aqui você pode ver o role ADMIN funcionando.</p>
            <p className="text-black">↠ ↠ Seja bem-vindo!! ↞ ↞</p>
          </div>
        </section>
      </main>
    </div>
  );
}
