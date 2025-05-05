import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/clients", icon: Users, label: "Clientes" },
    { path: "/charges", icon: FileText, label: "Emprestimos" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("@EvolutionCRM:token");
    navigate("/admin");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64" : "w-20"} 
        bg-gray-900 text-white`}
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h1
          className={`text-xl font-semibold flex items-center overflow-hidden ${
            !isExpanded && "scale-0"
          }`}
        >
          <CreditCard className="mr-2 flex-shrink-0" />
          <span
            className={`transition-all duration-300 ${
              !isExpanded ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            Sistema MDK
          </span>
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="mt-4 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                    ${!isExpanded ? "justify-center" : ""}
                    `
                  }
                  title={!isExpanded ? item.label : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 transition-all duration-300">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
          <li>
            <button
              onClick={handleLogout}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white w-full ${
                !isExpanded ? "justify-center" : ""
              }`}
              title={!isExpanded ? "Sair" : undefined}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isExpanded && (
                <span className="ml-3 transition-all duration-300">Sair</span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
