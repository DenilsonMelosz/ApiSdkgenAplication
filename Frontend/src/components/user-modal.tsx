import type React from "react"
import { useState, useEffect } from "react"
import type { User } from "@/lib/api-client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Tipo customizado para dados atualizados incluindo password
interface UpdatedUserData extends Partial<User> {
  password?: string
}

interface UserModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onSave: (updatedUser: UpdatedUserData) => Promise<void>
}

export function UserModal({ isOpen, onOpenChange, user, onSave }: UserModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  // Resetar formData sempre que o modal abrir para o usuário atual
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        password: "",
      })
    }
  }, [isOpen, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedData: UpdatedUserData = {}

      if (formData.name !== user.name) updatedData.name = formData.name
      if (formData.email !== user.email) updatedData.email = formData.email
      if (formData.phone !== (user.phone || "") && formData.phone) updatedData.phone = formData.phone
      if (formData.password) updatedData.password = formData.password

      // Se não houve alteração, fecha modal e retorna
      if (Object.keys(updatedData).length === 0) {
        onOpenChange(false)
        setLoading(false)
        return
      }

      await onSave(updatedData)

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "default",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar suas alterações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-purple-200 bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-purple-900">Editar Perfil</DialogTitle>
          <DialogDescription className="text-purple-600">
            Atualize suas informações pessoais abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-purple-800">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-purple-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-purple-800">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-purple-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-purple-800">
                Telefone (opcional)
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="border-purple-200"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-purple-800">
                Nova Senha (opcional)
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="border-purple-200"
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-purple-300 text-purple-800 hover:bg-purple-100"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
