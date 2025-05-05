import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PublicAuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  // Estados do cadastro
  const [registerForm, setRegisterForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
    carro: "",
    placa_carro: "",
    carro_alugado: false,
    contrato_aluguel: "",
    localizacao_residencial: "",
    comprovante_residencial: "",
    chave_pix: "",
    contato_familiar: "",
    foto_documento_selfie: "",
    status_cliente: "ativo",
    red_cliente: false,
  });
  const [fileInputs, setFileInputs] = useState({
    contrato_aluguel: null as File | null,
    comprovante_residencial: null as File | null,
    foto_documento_selfie: null as File | null,
  });
  // Estados do login
  const [loginForm, setLoginForm] = useState({
    cpf: "",
    senha: "",
  });
  // Estados de feedback
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handlers de mudança de input
  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setRegisterForm({ ...registerForm, [name]: e.target.checked });
    } else {
      setRegisterForm({ ...registerForm, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFileInputs({ ...fileInputs, [name]: files[0] });
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  // Handler de cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Garantir telefone no formato 55 + DDD + número
      const telefoneNumerico = registerForm.telefone.replace(/\D/g, "");
      let telefoneFormatado = telefoneNumerico;
      if (!telefoneNumerico.startsWith("55")) {
        telefoneFormatado = "55" + telefoneNumerico.replace(/^55+/, "");
      }
      const formToSend = { ...registerForm, telefone: telefoneFormatado };
      // Montar FormData
      const formData = new FormData();
      Object.entries(formToSend).forEach(([key, value]) => {
        if (
          key === "contrato_aluguel" ||
          key === "comprovante_residencial" ||
          key === "foto_documento_selfie"
        ) {
          if (fileInputs[key as keyof typeof fileInputs]) {
            formData.append(
              key,
              fileInputs[key as keyof typeof fileInputs] as File
            );
          }
        } else {
          formData.append(key, value as string);
        }
      });
      // Enviar para a API
      const response = await fetch(
        "https://api-node-mdk.pqfhfk.easypanel.host/api/clientes",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Erro ao cadastrar. Tente novamente.");
      setSuccess("Cadastro realizado com sucesso!");
      setRegisterForm({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        endereco: "",
        carro: "",
        placa_carro: "",
        carro_alugado: false,
        contrato_aluguel: "",
        localizacao_residencial: "",
        comprovante_residencial: "",
        chave_pix: "",
        contato_familiar: "",
        foto_documento_selfie: "",
        status_cliente: "ativo",
        red_cliente: false,
      });
      setFileInputs({
        contrato_aluguel: null,
        comprovante_residencial: null,
        foto_documento_selfie: null,
      });
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Handler de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      console.log("Enviando para API de login:", loginForm);
      const response = await fetch(
        "https://api-node-mdk.pqfhfk.easypanel.host/api/auth/cliente/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginForm),
        }
      );
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setSuccess("Login realizado com sucesso!");
        setLoginForm({ cpf: "", senha: "" });
        setTimeout(() => {
          navigate("/user");
        }, 500);
      } else {
        setError("CPF ou senha inválidos.");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="w-full text-center font-bold text-blue-700 text-xl mb-6">
          MDK SOLUÇÕES
        </div>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-bold ${
              tab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-bold ${
              tab === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setTab("register")}
          >
            Cadastro
          </button>
        </div>
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        {tab === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 font-medium">CPF</label>
              <input
                name="cpf"
                type="text"
                value={loginForm.cpf}
                onChange={handleLoginChange}
                required
                placeholder="Digite seu CPF"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-medium">Senha</label>
              <input
                name="senha"
                type="password"
                value={loginForm.senha}
                onChange={handleLoginChange}
                required
                placeholder="Digite sua senha"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <a
              href="https://wa.me/556181569275"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-md px-4 py-3 text-lg font-bold transition"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.28.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1.01-1 2.46 0 1.45 1.05 2.85 1.2 3.05.15.2 2.07 3.17 5.02 4.32.7.24 1.25.38 1.68.48.7.15 1.34.13 1.85.08.56-.06 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"
                />
              </svg>
              Dúvidas? Fale no WhatsApp
            </a>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5 px-1 pb-2">
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Nome</label>
              <input
                name="nome"
                value={registerForm.nome}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">E-mail</label>
              <input
                name="email"
                type="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Telefone</label>
              <input
                name="telefone"
                value={registerForm.telefone}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">CPF</label>
              <input
                name="cpf"
                value={registerForm.cpf}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Endereço</label>
              <input
                name="endereco"
                value={registerForm.endereco}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Carro</label>
              <input
                name="carro"
                value={registerForm.carro}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                Placa do Carro
              </label>
              <input
                name="placa_carro"
                value={registerForm.placa_carro}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex items-center">
              <input
                name="carro_alugado"
                type="checkbox"
                checked={registerForm.carro_alugado}
                onChange={handleRegisterChange}
                className="mr-2 accent-blue-600 w-5 h-5"
              />
              <label className="font-semibold text-gray-700 text-base">
                Carro Alugado?
              </label>
            </div>
            {registerForm.carro_alugado && (
              <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
                <label className="text-xs text-gray-500 mb-1">
                  Contrato de Aluguel (arquivo)
                </label>
                <input
                  name="contrato_aluguel"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                Localização Residencial
              </label>
              <input
                name="localizacao_residencial"
                value={registerForm.localizacao_residencial}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                Comprovante Residencial (arquivo)
              </label>
              <input
                name="comprovante_residencial"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Chave Pix</label>
              <input
                name="chave_pix"
                value={registerForm.chave_pix}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                Contato Familiar
              </label>
              <input
                name="contato_familiar"
                value={registerForm.contato_familiar}
                onChange={handleRegisterChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                Foto/Documento/Selfie (arquivo)
              </label>
              <input
                name="foto_documento_selfie"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <div className="flex flex-col items-center mt-2">
                <img
                  src="/static/selfie-exemplo.jpg"
                  alt="Exemplo selfie com documento"
                  className="rounded-lg max-h-40 border mb-1"
                />
                <span className="text-xs text-gray-500 text-center">
                  Exemplo: segure seu documento ao lado do rosto e tire uma foto
                  nítida.
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-lg shadow-md hover:bg-blue-700 transition"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
            <a
              href="https://wa.me/556181569275"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-md px-4 py-3 text-lg font-bold transition"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.28.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1.01-1 2.46 0 1.45 1.05 2.85 1.2 3.05.15.2 2.07 3.17 5.02 4.32.7.24 1.25.38 1.68.48.7.15 1.34.13 1.85.08.56-.06 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"
                />
              </svg>
              Dúvidas? Fale no WhatsApp
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
