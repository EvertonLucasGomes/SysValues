import type { ReactNode } from "react";
import { MainHeader } from "./MainHeader";
import { useNavigate, useLocation } from "react-router-dom"; // Importe useLocation
import { useState } from "react";
import { authService } from "@/services/api";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

interface SideMenuProps {
  children: ReactNode;
}

const menuItems = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: "📊",
  },
  {
    label: "Colheita",
    route: "/colheita",
    icon: "🌾",
  },
  {
    label: "Ferramentas",
    route: "/ferramentas",
    icon: "🔧",
  },
  {
    label: "Vendas",
    route: "/vendas",
    icon: "💰",
  },
  {
    label: "Notas Fiscais",
    route: "/notas",
    icon: "📄",
  },
  {
    label: "Unidades de Produção",
    route: "/UapPage",
    icon: "🏭",
  },
  {
    label: "Insumos",
    route: "/insumos",
    icon: "🧪",
  },
  {
    label: "Produtos",
    route: "/produtos",
    icon: "🌱",
  },
];

export function SideMenu({ children }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation(); // Use o hook useLocation para obter a rota atual
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-neutral-50">
      <MainHeader />

      <div className="flex flex-1 relative">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-agro-500 text-white rounded-lg shadow-lg"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-white shadow-soft border-r border-neutral-200
            transform transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo/Site name - Mais institucional
            <div className="p-6 border-b-2 border-agro-500 bg-agro-50">
              <h2 className="text-xl font-display font-bold text-agro-700">
                AgroSys
              </h2>
              <p className="text-sm text-agro-600 mt-1 font-medium">
                Sistema de Gestão Agropecuária
              </p>
              <div className="mt-2 w-8 h-1 bg-agro-500 rounded"></div>
            </div> */}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2" role="navigation">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.route;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.route);
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`
                      sidebar-item
                      ${
                        isActive
                          ? "sidebar-item-active"
                          : "sidebar-item-inactive"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User section - Mais robusto */}
            <div className="p-4 border-t-2 border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-neutral-200 shadow-sm">
                <div className="w-10 h-10 bg-agro-500 rounded-lg flex items-center justify-center shadow-institutional">
                  <span className="text-white text-sm font-bold">
                    {authService.getCurrentUser()?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900 truncate">
                    {authService.getCurrentUser()?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-neutral-500 truncate font-medium">
                    Nível:{" "}
                    {authService.getCurrentUser()?.role === "ADMIN"
                      ? "Administrador"
                      : "Usuário Comum"}
                  </p>
                </div>
                <button
                  onClick={() => authService.logout()}
                  className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                  title="Sair do sistema"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Page header - Mais institucional */}
          {/* Comentar a div inteira */}
          {/*
          <div className="bg-white border-b-2 border-agro-500 px-6 py-4 shadow-institutional">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-agro-700">
                  {menuItems.find((item) => item.route === location.pathname)
                    ?.label || "Bem-vindo"}
                </h1>
                <p className="text-sm text-agro-600 mt-1 font-medium">
                  Sistema de Gestão Agropecuária - Controle Total
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-agro-50 rounded-lg border border-agro-200">
                  <span className="text-sm font-semibold text-agro-700">
                    Status:
                  </span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-agro-600 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
          */}

          {/* Page content */}
          <section className="flex-1 p-6 overflow-auto bg-neutral-50">
            <div className="animate-fade-in">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
}