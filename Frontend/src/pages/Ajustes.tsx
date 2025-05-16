import { useEffect, useState } from "react"
import { Pencil, UserCog } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserModal } from "@/components/user-modal"
import { AdminModal } from "@/components/admin-modal"
import { NavBar } from "@/components/nav-bar"
import { AuthenticatedApiClient } from "@/lib/authenticatedApi"
import type { User as UserType } from "@/lib/api-client"

export function Ajustes() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/"
    } else {
      const api = new AuthenticatedApiClient("http://localhost:8000", token)
      api.getProfile().then(setCurrentUser).catch(console.error)
    }
  }, [])

  async function handleSave(updatedUser: Partial<UserType> & { password?: string }) {
  if (!currentUser) return

  try {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Token não encontrado")

    const api = new AuthenticatedApiClient("http://localhost:8000", token)

    const updated = await api.updateOwnProfile({
      name: updatedUser.name ?? currentUser.name,
      phone: updatedUser.phone ?? currentUser.phone ?? "",
      email: updatedUser.email ?? currentUser.email,
      password: updatedUser.password ?? ""
    })

    setCurrentUser(updated)
    setIsUserModalOpen(false)
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
  }
}

  if (!currentUser) return null

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <NavBar title="Ajustes" showBackButton={true} backUrl="/home" showSettingsButton={false} />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-purple-900">Configurações da Conta</h2>
            <p className="text-purple-600">Gerencie suas informações pessoais e preferências.</p>
          </div>

          <Card className="border-purple-100 bg-white shadow-md">
            <CardHeader className="border-b border-purple-100 bg-purple-50">
              <CardTitle className="text-xl text-purple-800">Perfil</CardTitle>
              <CardDescription className="text-purple-600">Suas informações pessoais e configurações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-purple-800">
                    Nome
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="name"
                      value={currentUser.name}
                      readOnly
                      className="border-purple-200 bg-purple-50 text-purple-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-800">
                    Email
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      value={currentUser.email}
                      readOnly
                      className="border-purple-200 bg-purple-50 text-purple-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-purple-300 bg-white text-purple-800 hover:bg-purple-100"
                  onClick={() => setIsUserModalOpen(true)}
                >
                  <Pencil className="h-4 w-4 text-purple-600" />
                  Editar Dados
                </Button>

                {currentUser.role === "ADMIN" && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-purple-300 bg-white text-purple-800 hover:bg-purple-100"
                    onClick={() => setIsAdminModalOpen(true)}
                  >
                    <UserCog className="h-4 w-4 text-purple-600" />
                    Gerenciar Usuários
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <UserModal
        isOpen={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        user={currentUser}
        onSave={handleSave}
      />

      {currentUser.role === "ADMIN" && (
        <AdminModal isOpen={isAdminModalOpen} onOpenChange={setIsAdminModalOpen} />
      )}
    </div>
  )
}
