import { useCallback, useEffect, useState } from "react"
import { Eye, EyeOff, Key, Search, Trash2 } from "lucide-react"
import type { User } from "@/lib/api-client"
import { AuthenticatedApiClient } from "@/lib/authenticatedApi"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface AdminModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminModal({ isOpen, onOpenChange }: AdminModalProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [passwordResetUser, setPasswordResetUser] = useState<User | null>(null)
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    if (!isOpen) return

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const api = new AuthenticatedApiClient("http://localhost:8000", token)
      const usersData = await api.listUsers()
      setUsers(usersData)
    } catch (err) {
      console.error("Erro ao buscar usuários:", err)
      setError("Não foi possível carregar a lista de usuários. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen, fetchUsers])

  const filteredUsers: User[] = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setActionLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const api = new AuthenticatedApiClient("http://localhost:8000", token)
      await api.deleteUser({ userId: userToDelete.id })

      setUsers(users.filter((user) => user.id !== userToDelete.id))
      setUserToDelete(null)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
        variant: "default",
      })
    } catch (err) {
      console.error("Erro ao excluir usuário:", err)
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível excluir o usuário. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!passwordResetUser) return

    setActionLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const api = new AuthenticatedApiClient("http://localhost:8000", token)
      const generatedPassword = await api.generateNewPassword({ userId: passwordResetUser.id })

      setNewPassword(generatedPassword)

      toast({
        title: "Senha redefinida",
        description: "A nova senha foi gerada com sucesso.",
        variant: "default",
      })
    } catch (err) {
      console.error("Erro ao redefinir senha:", err)
      toast({
        title: "Erro ao redefinir senha",
        description: "Não foi possível redefinir a senha. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="border-purple-200 bg-white sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Gerenciar Usuários</DialogTitle>
            <DialogDescription className="text-purple-600">
              Visualize, Atualize a Senha ou remova usuários do sistema.
            </DialogDescription>
          </DialogHeader>

          {error && <div className="rounded-md bg-red-50 p-4 text-red-800 border border-red-200 mb-4">{error}</div>}

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Buscar usuários..."
              className="border-purple-200 pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader className="bg-purple-50">
                <TableRow>
                  <TableHead className="text-purple-800">Nome</TableHead>
                  <TableHead className="text-purple-800">Email</TableHead>
                  <TableHead className="text-purple-800">Tipo</TableHead>
                  <TableHead className="text-right text-purple-800">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-purple-50">
                      <TableCell className="font-medium text-purple-900">{user.name}</TableCell>
                      <TableCell className="text-purple-700">{user.email}</TableCell>
                      <TableCell className="text-purple-700">
                        {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setPasswordResetUser(user)
                              setNewPassword("")
                              setShowPassword(false)
                              setIsPasswordResetDialogOpen(true)
                            }}
                            className="border-purple-200 text-purple-700 hover:bg-purple-100"
                          >
                            <Key className="h-4 w-4" />
                            <span className="sr-only">Resetar senha</span>
                          </Button>

                          {user.role !== "ADMIN" && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setUserToDelete(user)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="border-purple-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-purple-600">
                      {searchTerm ? "Nenhum usuário encontrado com esse termo." : "Nenhum usuário encontrado."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-purple-200 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-900">Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription className="text-purple-700">
              Tem certeza que deseja excluir o usuário {userToDelete?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-purple-200 text-purple-800 hover:bg-purple-100" disabled={actionLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-500 text-white hover:bg-red-600" disabled={actionLoading}>
              {actionLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen}>
        <AlertDialogContent className="border-purple-200 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-900">Resetar Senha</AlertDialogTitle>
            <AlertDialogDescription className="text-purple-700">
              Gerar nova senha para {passwordResetUser?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {newPassword && (
            <div className="mb-4 mt-2 rounded-md bg-purple-50 p-3">
              <p className="text-sm font-medium text-purple-900">Nova senha gerada:</p>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  readOnly
                  className="font-mono text-sm text-purple-800 bg-transparent border-none outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-purple-700 hover:text-purple-900"
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-purple-600">
                Guarde esta senha em um local seguro. Ela não será mostrada novamente.
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="border-purple-200 text-purple-800 hover:bg-purple-100" disabled={actionLoading}>
              Fechar
            </AlertDialogCancel>
            {!newPassword && (
              <AlertDialogAction onClick={handleResetPassword} className="bg-purple-600 text-white hover:bg-purple-700" disabled={actionLoading}>
                {actionLoading ? "Gerando..." : "Gerar Nova Senha"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
