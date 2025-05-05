import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      icon: <LayoutDashboard className="w-6 h-6" />,
      label: "Dashboard",
    },
    {
      path: "/clients",
      icon: <Users className="w-6 h-6" />,
      label: "Clientes",
    },
    {
      path: "/contracts",
      icon: <FileText className="w-6 h-6" />,
      label: "Contratos",
    },
    {
      path: "/settings",
      icon: <Settings className="w-6 h-6" />,
      label: "Configurações",
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <span className="text-xl font-semibold text-gray-800">
              Evolution
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-gray-100 ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">admin@example.com</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
