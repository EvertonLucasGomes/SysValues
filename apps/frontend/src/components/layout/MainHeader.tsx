import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { NotificationButton } from "../ui/";
import { authService } from "@/services/api";
import { Link } from "react-router-dom";

export function MainHeader() {
  return (
    <header className="w-full bg-white shadow-institutional border-b-2 border-agro-500">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-4">
          <div className="relative">
            <img
              src={logo}
              alt="AgroSys Logo"
              className="h-16 w-16 object-contain drop-shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-agro-500 rounded-full border-2 border-white shadow-institutional"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-3xl font-display font-bold text-agro-700 leading-tight">
              AgroSys
            </h1>
            <p className="text-sm font-semibold text-agro-600 -mt-1">
              Sistema de Gestão Agropecuária
            </p>
            <div className="mt-1 w-12 h-1 bg-agro-500 rounded"></div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-agro-50 rounded-lg border border-agro-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-agro-700">
              Sistema Ativo
            </span>
          </div>

          <NotificationButton />

          {/* Adicione a propriedade onClick ao botão de configurações */}
          <button
            onClick={() => alert("Funcionalidade de configurações em breve!")}
            className="p-2 text-agro-600 hover:text-agro-700 transition-colors group bg-agro-50 rounded-lg border border-agro-200"
          >
            <FaCog size={18} />
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Configurações
            </span>
          </button>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-agro-50 transition-colors cursor-pointer group border border-neutral-200">
            <div className="relative">
              <FaUserCircle size={32} className="text-agro-600" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-neutral-900">
                {authService.getCurrentUser()?.name || "Usuário"}
              </p>
              <p className="text-xs font-semibold text-agro-600">
                Nível:{" "}
                {authService.getCurrentUser()?.role === "ADMIN"
                  ? "Administrador"
                  : "Usuário Comum"}
              </p>
            </div>
            <button
              onClick={() => authService.logout()}
              className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
              title="Sair do sistema"
            >
              <FaSignOutAlt size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


// import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
// import logo from "../../assets/logo.png";
// import { NotificationButton } from "../ui/";
// import { authService } from "@/services/api";
// // 1. Importar o componente Link do react-router-dom
// import { Link } from "react-router-dom";

// export function MainHeader() {
//   return (
//     <header className="w-full bg-white shadow-institutional border-b-2 border-agro-500">
//       <div className="flex items-center justify-between px-6 py-4">
//         {/* Logo and Brand - Agora com Link para a home */}
//         {/* 2. Envolver a logo e o texto com o componente Link */}
//         <Link to="/dashboard" className="flex items-center gap-4">
//           <div className="relative">
//             <img
//               src={logo}
//               alt="AgroSys Logo"
//               className="h-16 w-16 object-contain drop-shadow-sm"
//             />
//             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-agro-500 rounded-full border-2 border-white shadow-institutional"></div>
//           </div>
//           <div className="hidden sm:block">
//             <h1 className="text-3xl font-display font-bold text-agro-700 leading-tight">
//               AgroSys
//             </h1>
//             <p className="text-sm font-semibold text-agro-600 -mt-1">
//               Sistema de Gestão Agropecuária
//             </p>
//             <div className="mt-1 w-12 h-1 bg-agro-500 rounded"></div>
//           </div>
//         </Link>

//         {/* User Actions - Mais robusto */}
//         <div className="flex items-center gap-4">
//           {/* System Status */}
//           <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-agro-50 rounded-lg border border-agro-200">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="text-sm font-semibold text-agro-700">
//               Sistema Ativo
//             </span>
//           </div>

//           {/* Notifications */}
//           <NotificationButton />

//           {/* Settings */}
//           <button className="p-2 text-agro-600 hover:text-agro-700 transition-colors group bg-agro-50 rounded-lg border border-agro-200">
//             <FaCog size={18} />
//             <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//               Configurações
//             </span>
//           </button>

//           {/* User Profile - Mais institucional */}
//           <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-agro-50 transition-colors cursor-pointer group border border-neutral-200">
//             <div className="relative">
//               <FaUserCircle size={32} className="text-agro-600" />
//               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-bold text-neutral-900">
//                 {authService.getCurrentUser()?.name || "Usuário"}
//               </p>
//               <p className="text-xs font-semibold text-agro-600">
//                 Nível:{" "}
//                 {authService.getCurrentUser()?.role === "ADMIN"
//                   ? "Administrador"
//                   : "Usuário Comum"}
//               </p>
//             </div>
//             <button
//               onClick={() => authService.logout()}
//               className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
//               title="Sair do sistema"
//             >
//               <FaSignOutAlt size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
// import logo from "../../assets/logo.png";
// import { NotificationButton } from "../ui/";
// import { authService } from "@/services/api";


// export function MainHeader() {
//   return (
//     <header className="w-full bg-white shadow-institutional border-b-2 border-agro-500">
//       <div className="flex items-center justify-between px-6 py-4">
//         {/* Logo and Brand - Mais institucional */}
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <img
//               src={logo}
//               alt="AgroSys Logo"
//               className="h-16 w-16 object-contain drop-shadow-sm"
//             />
//             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-agro-500 rounded-full border-2 border-white shadow-institutional"></div>
//           </div>
//           <div className="hidden sm:block">
//             <h1 className="text-3xl font-display font-bold text-agro-700 leading-tight">
//               AgroSys
//             </h1>
//             <p className="text-sm font-semibold text-agro-600 -mt-1">
//               Sistema de Gestão Agropecuária
//             </p>
//             <div className="mt-1 w-12 h-1 bg-agro-500 rounded"></div>
//           </div>
//         </div>

//         {/* User Actions - Mais robusto */}
//         <div className="flex items-center gap-4">
//           {/* System Status */}
//           <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-agro-50 rounded-lg border border-agro-200">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="text-sm font-semibold text-agro-700">
//               Sistema Ativo
//             </span>
//           </div>

//           {/* Notifications */}
//           <NotificationButton />

//           {/* Settings */}
//           <button className="p-2 text-agro-600 hover:text-agro-700 transition-colors group bg-agro-50 rounded-lg border border-agro-200">
//             <FaCog size={18} />
//             <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//               Configurações
//             </span>
//           </button>

//           {/* User Profile - Mais institucional */}
//           <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-agro-50 transition-colors cursor-pointer group border border-neutral-200">
//             <div className="relative">
//               <FaUserCircle size={32} className="text-agro-600" />
//               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-bold text-neutral-900">
//                 {authService.getCurrentUser()?.name || "Usuário"}
//               </p>
//               <p className="text-xs font-semibold text-agro-600">
//                 Nível:{" "}
//                 {authService.getCurrentUser()?.role === "ADMIN"
//                   ? "Administrador"
//                   : "Usuário Comum"}
//               </p>
//             </div>
//             <button
//               onClick={() => authService.logout()}
//               className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
//               title="Sair do sistema"
//             >
//               <FaSignOutAlt size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }