import { Routes, Route, useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ClientsPage } from "../pages/ClientsPage";
import { useState } from "react";
import { ClientProfilePage } from "../pages/ClientProfilePage";

function PublicLoginForm() {
  const [form, setForm] = useState({
    cpf: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await fetch("/api/auth/cliente/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setSuccess("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/perfil");
        }, 1000);
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login do Cliente
        </h1>
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">CPF</label>
          <input
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
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
            value={form.senha}
            onChange={handleChange}
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
      </form>
    </div>
  );
}

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Página pública de login na rota index */}
      <Route index element={<PublicLoginForm />} />
      <Route path="/perfil" element={<ClientProfilePage />} />
      <Route path="/" element={<AppLayout />}>
        {/* Rotas principais */}
        <Route
          path="dashboard"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
          }
        />
        <Route path="clients" element={<ClientsPage />} />
        <Route
          path="charges"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Cobranças
              </h1>
            </div>
          }
        />
        <Route
          path="users"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Usuários
              </h1>
            </div>
          }
        />
        <Route
          path="financial"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Financeiro
              </h1>
            </div>
          }
        />
        <Route
          path="settings"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Configurações
              </h1>
            </div>
          }
        />
        {/* Rota 404 */}
        <Route
          path="*"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Página não encontrada
              </h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};
