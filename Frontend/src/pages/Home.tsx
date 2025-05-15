import { useEffect, useState } from "react"
import { Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthenticatedApiClient } from "@/lib/authenticatedApi"
import type { User as UserType } from "@/lib/api-client"
import { NavBar } from "@/components/nav-bar"

export  function Home() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/login"
    } else {
      const api = new AuthenticatedApiClient("http://localhost:8000", token)
      api.getProfile().then(setUser).catch(console.error)
    }
  }, [])

  const handleGoToProfile = () => {
    window.location.href = "/profile"
  }

  const handleGoToSettings = () => {
    window.location.href = "/ajustes"
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <NavBar title="Dashboard" showHomeIcon={true} showBackButton={false} />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <section className="mx-auto max-w-4xl space-y-8">
          <div className="flex flex-col gap-2">
             <h2 className="text-3xl font-bold tracking-tight text-purple-900">
                Bem-vindo ao seu Dashboard{user?.name ? ` ${user.name.split(" ")[0]}` : ""}
            </h2>
            <p className="text-black-600">Acesse rapidamente as funcionalidades mais importantes.</p>
          </div>

          <Card className="border-purple-100 bg-white shadow-md">
            <CardHeader className="border-b border-purple-100 bg-purple-50">
              <CardTitle className="text-xl text-purple-800">Acesso Rápido</CardTitle>
              <CardDescription className="text-purple-600">
                Lista de funcionalidades disponiveis na api.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <Button
                variant="outline"
                className="justify-start border-purple-200 bg-white text-purple-800 hover:bg-purple-100"
                onClick={handleGoToSettings}
                size="lg"
              >
                <Settings className="mr-2 h-5 w-5 text-purple-600" />
                Ajustes de Conta
              </Button>
              <Button
                variant="outline"
                className="justify-start border-purple-200 bg-white text-purple-800 hover:bg-purple-100"
                size="lg"
                onClick={handleGoToProfile}
              >
                <User className="mr-2 h-5 w-5 text-purple-600" />
                Gerenciar Perfil
              </Button>
            </CardContent>
            <CardFooter className="bg-purple-50 px-6 py-4">
              <p className="text-sm text-purple-600">Acesse suas configurações para personalizar sua experiência.</p>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  )
}
