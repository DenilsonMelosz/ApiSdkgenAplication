"use client"

import type { ReactNode } from "react"
import { ArrowLeft, Cog, HomeIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavBarProps {
  title: string
  showBackButton?: boolean
  backUrl?: string
  showHomeIcon?: boolean
  showProfileButton?: boolean
  showSettingsButton?: boolean
  children?: ReactNode
}

export function NavBar({
  title,
  showBackButton = false,
  backUrl = "/",
  showHomeIcon = false,
  showProfileButton = true,
  showSettingsButton = true,
  children,
}: NavBarProps) {
  const handleNavigation = (url: string) => {
    window.location.href = url
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation(backUrl)}
            className="mr-2 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
          </Button>
        )}

        {showHomeIcon && <HomeIcon className="h-6 w-6 text-purple-600" />}

        <h1 className="text-xl font-semibold text-purple-900">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {children}

        {showProfileButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation("/profile")}
            className="border-purple-200 hover:bg-purple-100 hover:text-purple-700"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Perfil</span>
          </Button>
        )}

        {showSettingsButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation("/ajustes")}
            className="border-purple-200 hover:bg-purple-100 hover:text-purple-700"
          >
            <Cog className="h-5 w-5" />
            <span className="sr-only">Ajustes</span>
          </Button>
        )}

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="text-purple-700 hover:bg-purple-100 hover:text-purple-900 flex items-center gap-1"
          size="sm"
        >
          <span>Sair</span>
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Button>
      </div>
    </header>
  )
}
