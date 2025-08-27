import logo from "../assets/logo.png";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import type { RegisterFormData } from "@/types/forms/register-form-data";

interface RegisterFormProps {
  onSubmit: (
    data: Omit<RegisterFormData, "confirmPassword">
  ) => Promise<void> | void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNameError("");
    setFormError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");

    // Validação do usuario
    if (!name) {
      setNameError("Informe um nome válido.");
      return;
    }

    // Validação do email
    if (!email) {
      setEmailError("Informe um e-mail válido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Informe um e-mail válido.");
      return;
    }

    // Validação da senha
    if (password.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("A senha deve conter pelo menos uma letra maiúscula.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("A senha deve conter pelo menos uma letra minúscula.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("A senha deve conter pelo menos um número.");
      return;
    }

    // Validação da confirmação
    if (password !== confirmPassword) {
      setConfirmError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ email, password, name });
    } catch {
      setFormError("Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f4e9] rounded-2xl shadow-2xl p-10 w-full max-w-md space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <img src={logo} alt="Logo" className="w-20 h-20" />
        <h2 className="text-2xl font-bold text-[#1b5e1f] tracking-wider">
          CRIAR CONTA
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-600">Usuário</label>
          <input
            placeholder="Nome de usuário"
            className="w-full mt-1 p-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="username"
          />
          {nameError && (
            <p className="text-red-600 text-sm mt-1">{nameError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600">E-mail</label>
          <input
            type="text"
            placeholder="Email institucional"
            className="w-full mt-1 p-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          {emailError && (
            <p className="text-red-600 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600">Senha</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="w-full mt-1 p-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-600 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-600 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600">Confirmar Senha</label>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              className="w-full mt-1 p-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-600 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {confirmError && (
            <p className="text-red-600 text-sm mt-1">{confirmError}</p>
          )}
        </div>

        <Button
          type="submit"
          color="#1b5e1f"
          className="block"
          disabled={isLoading}
        >
          {isLoading ? "CRIANDO..." : "CRIAR CONTA"}
        </Button>
      </form>

      {formError && (
        <div className="text-red-600 text-sm text-center">{formError}</div>
      )}

      <div className="text-center text-sm text-gray-600">
        Já possui conta?{" "}
        <Link to="/login" className="text-green-700 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
