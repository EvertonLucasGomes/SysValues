import type { ReactNode } from "react";
import { MainHeader } from "./MainHeader";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; 

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
  const location = useLocation();
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
          {/* Page content */}
          <section className="flex-1 p-6 overflow-auto bg-neutral-50">
            <div className="animate-fade-in">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
}