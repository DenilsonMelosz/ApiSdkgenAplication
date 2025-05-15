import { useState } from "react"
import { Link } from "react-router-dom"
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

const api = new ApiClient("http://localhost:8000")

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido!" }),
  password: z.string().min(6, { message: "Senha é obrigatória!" }),
})

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  // form com zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    try {
      const response = await api.login({
        email: values.email,
        password: values.password,
      })

      const { token, user } = response

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
           
      toast({
        title: "Login concluído",
        description: `Bem-vindo(a), ${user.name}!`,
      })
        // tempo de exibição do toast
      setTimeout(() => {
        window.location.href = "/home"
      }, 2000)

    } catch (err) {
      if (err instanceof InvalidCredentials) {
        toast({
          title: "Erro no login",
          description: "E-mail ou senha incorretos",
          variant: "destructive",
        })
      } else {
        toast({
          title: "E-mail ou senha incorreto",
          description: "Erro ao fazer login",
          variant: "destructive",
        })
        console.error("Erro inesperado no login:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-primary-dark">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary-dark">Bem-vindo!</CardTitle>
        <CardDescription>Entre com seu e-mail e senha para acessar sua conta.</CardDescription>
        <div className="text-sm">
          <Link to="/signup" className="text-primary-dark hover:text-primary-darker hover:underline">
            Não possui conta? <span className="font-bold">Registre-se Grátis</span>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        placeholder="Digite a sua Senha"
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

            <div className="flex justify-end">
              <Link
                to="/recuperar-senha"
                className="text-sm text-primary-darker hover:text-primary-dark hover:underline"
              >
                Esqueceu sua <span className="font-bold">Senha?</span>
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary-darker text-white"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
