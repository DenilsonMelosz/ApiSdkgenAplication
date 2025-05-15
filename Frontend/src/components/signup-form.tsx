import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ApiClient, InvalidCredentials } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Assumindo que você terá uma implementação similar do ApiClient
const api = new ApiClient("http://localhost:8000")

// Função para formatar o telefone
function formatPhone(value: string) {
  const cleaned = value.replace(/\D/g, "").slice(0, 11)
  if (cleaned.length <= 2) return `(${cleaned}`
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
}

const formSchema = z
  .object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "E-mail inválido" }),
    phone: z.string().refine(
      (val) => {
        const digits = val.replace(/\D/g, "")
        return digits.length >= 10 && digits.length <= 11
      },
      { message: "Número de telefone inválido" },
    ),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export function SignupForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const { toast } = useToast()

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    setError(null)

    try {
      await api.signup({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: "+55" + phone.replace(/\D/g, ""),
      })

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada. Você já pode fazer login.",
      })

      navigate("/")
    } catch (err) {
      if (err instanceof InvalidCredentials) {
        setError(err.data.message || "Erro ao cadastrar")
      } else {
        setError("Ocorreu um erro ao cadastrar")
        console.error("Erro no cadastro:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-primary-dark">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary-dark">Criar nova conta</CardTitle>
        <CardDescription>Preencha os campos abaixo para criar sua conta.</CardDescription>
        <div className="text-sm">
          <Link to="/" className="text-primary-dark hover:text-primary-darker hover:underline">
            Já possui conta? <span className="font-bold">Faça login</span>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome completo"
                      {...field}
                      className="focus-visible:ring-primary-dark"
                    />
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Digite seu telefone"
                      value={phone}
                      onChange={(e) => {
                        const formattedPhone = formatPhone(e.target.value)
                        setPhone(formattedPhone)
                        field.onChange(formattedPhone)
                      }}
                      className="focus-visible:ring-primary-dark"
                    />
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Digite seu e-mail"
                      type="text"
                      {...field}
                      className="focus-visible:ring-primary-dark"
                    />
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Digite sua senha"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="focus-visible:ring-primary-dark"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-primary-darker hover:text-primary-dark"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirme sua senha"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        className="focus-visible:ring-primary-dark"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-primary-darker hover:text-primary-dark"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary-darker text-white"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
