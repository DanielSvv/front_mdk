import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  tipo: string;
}

export function ClientProfilePage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioStr = localStorage.getItem("usuario");
    if (!token || !usuarioStr) {
      navigate("/");
      return;
    }
    setUsuario(JSON.parse(usuarioStr));
  }, [navigate]);

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Perfil do Cliente
        </h1>
        <div className="mb-4">
          <span className="font-medium">Nome:</span> {usuario.nome}
        </div>
        <div className="mb-4">
          <span className="font-medium">CPF:</span> {usuario.cpf}
        </div>
        <div className="mb-4">
          <span className="font-medium">Tipo:</span> {usuario.tipo}
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            navigate("/");
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
