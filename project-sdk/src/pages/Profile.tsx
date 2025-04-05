import { useEffect, useState } from "react"
import { ApiClient, type User } from "../generated/api-client"
import "./profile.css"

const api = new ApiClient("http://localhost:8000")

export function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const { id } = JSON.parse(storedUser)

      api
        .getProfile({ userId: id })
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

  // Obter iniciais do nome para o avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <div className="profile-nav-logo">MINHA API SDK</div>
          <button
            className="profile-logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Sair <span className="logout-icon">↪</span>
          </button>

      </nav>

      <div className="profile-card">
        <div className="profile-banner"></div>

        <div className="profile-avatar-container">
          <div className="profile-avatar">{user ? getInitials(user.name) : "?"}</div>
        </div>

        <div className="profile-header">
          {loading ? (
            <div className="profile-skeleton profile-name-skeleton"></div>
          ) : (
            <h2 className="profile-name">{user?.name || "Usuário não encontrado"}</h2>
          )}
          <div className="profile-badges">
            <span className="profile-badge profile-badge-blue">Perfil</span>
            <span className="profile-badge profile-badge-purple">Usuário</span>
          </div>
        </div>

        <div className="profile-content">
          {loading ? (
            <div className="profile-loading">
              <div className="profile-skeleton profile-skeleton-full"></div>
              <div className="profile-skeleton profile-skeleton-full"></div>
              <div className="profile-skeleton profile-skeleton-partial"></div>
            </div>
          ) : user ? (
            
            <div className="profile-info">
              {/* Adiciona as inf de Nome */}
              <div className="profile-info-item">
                <div className="profile-info-icon profile-icon-user">👤</div>
                <div className="profile-info-text">
                  <p className="profile-info-label">Nome</p>
                  <p className="profile-info-value">{user.name}</p>
                </div>
              </div>

              {/* Adiciona as inf de e-mail */}
              <div className="profile-info-item">
                <div className="profile-info-icon profile-icon-email">✉️</div>
                <div className="profile-info-text">
                  <p className="profile-info-label">Email</p>
                  <p className="profile-info-value">{user.email}</p>
                </div>
              </div>
            
          {/* Adiciona as inf de telefone */}
          <div className="profile-info-item">
                <div className="profile-info-icon profile-icon-phone">📞</div>
                <div className="profile-info-text">
                  <p className="profile-info-label">Telefone</p>
                  <p className="profile-info-value">{user.phone}</p>
                </div>
              </div>
             </div>
          ) : (
            <div className="profile-empty">
              Nenhuma informação de usuário encontrada. Por favor, faça login novamente.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

