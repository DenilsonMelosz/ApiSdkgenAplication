import { useEffect, useState } from "react"
import type { User } from "@/lib/api-client"
import { AuthenticatedApiClient } from "@/lib/authenticatedApi"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    console.log("Token armazenado:", storedToken)

    if (storedToken) {
      // Cria a instância do AuthenticatedApiClient com o token armazenado
      const api = new AuthenticatedApiClient("http://localhost:8000", storedToken)
     
      api
        .getProfile()
        .then((data) => {
          setUser(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Erro ao buscar perfil:", err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Barra de navegação */}
      <nav className="sticky top-0 left-0 right-0 h-[60px] bg-white flex justify-between items-center px-4 md:px-5 shadow-md z-50">
        <div className="text-lg md:text-xl font-bold text-primary-dark">MINHA API SDK</div>
        <Button
          onClick={handleLogout}
          className="bg-gradient-to-r from-primary-dark to-primary-darker text-white rounded-full"
          size="sm"
        >
          Sair <span className="ml-1">↪</span>
        </Button>
      </nav>

      {/* Conteúdo principal */}
      <main className="flex justify-center px-4 py-6 md:py-8">
        <Card className="w-full max-w-[500px] overflow-hidden relative mx-auto border-primary-dark">
          {/* Banner do perfil */}
          <div className="h-[100px] md:h-[130px] bg-gradient-to-r from-primary-dark to-primary-darker relative"></div>

          {/* Container do avatar */}
          <div className="flex justify-center relative mt-[-40px] md:mt-[-50px]">
            <Avatar className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-4 border-white shadow-md">
              <AvatarFallback className="bg-primary-dark text-white text-[22px] md:text-[28px] font-bold">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Cabeçalho do perfil */}
          <CardHeader className="text-center px-4 md:px-5 pt-[10px] space-y-2">
            {loading ? (
              <Skeleton className="h-[28px] w-[200px] mx-auto" />
            ) : (
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 break-words">
                {user?.name || "Usuário não encontrado"}
              </h2>
            )}
            <div className="flex justify-center gap-[10px] flex-wrap">
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                Perfil
              </Badge>
              <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-100">
                Usuário
              </Badge>
            </div>
          </CardHeader>

          {/* Conteúdo do perfil */}
          <CardContent className="p-4 md:p-5">
            {loading ? (
              <div className="flex flex-col gap-[15px]">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : user ? (
              <div className="flex flex-col gap-[12px] md:gap-[15px]">
                <ProfileItem icon="👤" label="Nome" value={user.name} />
                <ProfileItem icon="✉️" label="Email" value={user.email} />
                <ProfileItem icon="📞" label="Telefone" value={user.phone || "Não informado"} />
              </div>
            ) : (
              <div className="text-center p-4 md:p-5 text-gray-500">
                Nenhuma informação de usuário encontrada. Por favor, faça login novamente.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

interface ProfileItemProps {
  icon: string
  label: string
  value: string
}

function ProfileItem({ icon, label, value }: ProfileItemProps) {
  return (
    <div className="flex items-center gap-[12px] md:gap-[15px] p-[12px] md:p-[15px] rounded-[10px] bg-gray-50 transition-colors duration-200 hover:bg-gray-100">
      <div className="text-lg md:text-xl w-[36px] h-[36px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-lg bg-blue-50">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] md:text-xs text-gray-500 m-0 mb-[3px] md:mb-[5px]">{label}</p>
        <p className="text-sm md:text-base font-medium text-gray-800 m-0 break-words">{value}</p>
      </div>
    </div>
  )
}
