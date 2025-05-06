import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { ApiClient } from "../generated/api-client"
import { InvalidCredentials } from "../generated/api-client"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import illustration from "../assets/illustration2..jpg"
import "./style.css"

// Conexão da API para se conectar ao backend em execução na porta 8000
// A API deve estar rodando na porta 8000, se não estiver, altere a URL abaixo
const api = new ApiClient("http://localhost:8000")

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

function formatPhone(value: string) {
  const cleaned = value.replace(/\D/g, "").slice(0, 11)
  if (cleaned.length <= 2) return `(${cleaned}`
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  if (cleaned.length <= 10)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
}

export function Signup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const password = watch("password")

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)

    try {
      const user = await api.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: "+55" + phone.replace(/\D/g, ""),
      })

      console.log("Cadastro realizado com sucesso:", user)
      navigate("/")
    } catch (err) {
      if (err instanceof InvalidCredentials) {
        setError(err.data.message)
      } else {
        setError("Ocorreu um erro ao cadastrar")
        console.error("Erro no cadastro:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-[#ffffff]">
        <div className="text-center text-white p-8">
          <img src={illustration || "/placeholder.svg"} alt="Projeto" className="logo" />
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-96">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">Criar nova conta</h2>
          <p className="text-login text-gray-600 mb-6">Preencha os campos abaixo para criar sua conta.</p>

          <div className="register">
            <Link to="/" className="text-purple-600">
              Já possui conta? <span className="font-bold">Faça login</span>
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: { value: 3, message: "Nome deve ter pelo menos 3 caracteres" },
                })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
              <input
                id="phone"
                type="text"
                placeholder="Digite seu telefone"
                {...register("phone", {
                  required: "Telefone é obrigatório",
                  validate: (value) => {
                    const digits = value.replace(/\D/g, "")
                    if (digits.length < 10 || digits.length > 11) {
                      return "Número de telefone inválido"
                    }
                    return true
                  },
                })}
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div className="mb-4">
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                {...register("email", {
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido",
                  },
                })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-4 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: { value: 6, message: "A senha deve ter pelo menos 6 caracteres" },
                })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 btn-visibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div className="mb-6 relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                {...register("confirmPassword", {
                  required: "Confirmação de senha é obrigatória",
                  validate: (value) => value === password || "As senhas não coincidem",
                })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 btn-visibility"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
