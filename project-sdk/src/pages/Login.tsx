import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiClient } from '../generated/api-client';
import { InvalidCredentials } from '../generated/api-client';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import illustration from "../assets/illustration..jpg"; 
import "./style.css";



type FormData = {
  email: string;
  password: string;
};

// Conexão da API para se conectar ao backend em execução na porta 8000
// A API deve estar rodando na porta 8000, se não estiver, altere a URL abaixo
const api = new ApiClient("http://localhost:8000")

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await api.login(data);
      console.log('Login successful:', user);
  
      // Salvando localmente as informações do usuario logado, para uso posterior e controlar estado de autenticação
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = '/profile';
    } catch (err) {
      if (err instanceof InvalidCredentials) {
        setError('E-mail ou senha incorretos');
      } else {
        setError('Usuario não localizado!');
        console.error('Login erro, usuario nao localizado ou backend off', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-[#315259]">
        <div className="text-center text-white p-8">
          <img src={illustration} alt="Projeto" className="logo" />
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-96">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">Bem-vindo!</h2>
          <p className="text-login text-gray-600 mb-6">Entre com seu e-mail e senha para acessar sua conta.</p>

          <div className="register">
            <Link to="/signup" className="text-purple-600">
              Não possui conta? <span className="font-bold">Registre-se Grátis</span>
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                {...register('email', { required: 'E-mail é obrigatório' })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite a sua Senha"
                {...register('password', { required: 'Senha é obrigatória' })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 btn-visibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end text-sm text-gray-600 mb-6">
              <Link to="/recuperar-senha" className="text-gray-600">
                Esqueceu sua <span className="font-bold">Senha?</span>
              </Link>
            </div>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
