import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SideMenu } from "../../../components/layout/SideMenu";
import { PageHeader } from "../../../components/ui/PageHeader";
import { FilterBar } from "../../../components/ui/FilterBar";
import { DataTable } from "../../../components/ui/DataTable";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useUap } from "@/hooks/useUap";

function UapPage() {
  const navigate = useNavigate();
  // Este hook não está em conflito, então o mantemos como está:
  const { uaps, loading, error, fetchUaps, deleteUap } = useUap();

  useEffect(() => {
    fetchUaps();
  }, [fetchUaps]);

  const handleDelete = async (uapId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta UAP?")) {
      try {
        await deleteUap(uapId);
      } catch {
        // erro tratado pelo hook
      }
    }
  };

  // CONFLITO 1 RESOLVIDO: Combino a estrutura da 'main' (com 'align: center')
  // e adiciono a coluna 'actions' da sua branch (samille).
  const columns = [
    { key: "name", label: "UAP", align: "center" },
    { key: "location", label: "LOCALIZAÇÃO", align: "center" },
    { key: "area", label: "ÁREA", align: "center" },
    { key: "responsible", label: "RESPONSÁVEL", align: "center" },
    { key: "actions", label: "AÇÕES", align: "center" }, // Mantém a coluna de ações da sua branch
  ];

  const filters = [
    {
      key: "location",
      label: "Localização",
      options: [
        { value: "norte", label: "Seção Norte" },
        { value: "sul", label: "Seção Sul" },
        { value: "leste", label: "Seção Leste" },
        { value: "oeste", label: "Seção Oeste" },
        { value: "central", label: "Seção Central" },
        { value: "nordeste", label: "Seção Nordeste" },
      ],
      placeholder: "Filtrar por localização",
    },
  ];

  if (loading) {
    return (
      <SideMenu title="UNIDADES DE PRODUÇÃO">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando UAPs...</p>
          </div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    return (
      <SideMenu title="UNIDADES DE PRODUÇÃO">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar UAPs: {error}</p>
            <button onClick={() => fetchUaps()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  return (
    <SideMenu title="UNIDADES DE PRODUÇÃO">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Unidades de Produção"
          subtitle="Gerencie suas unidades de produção"
        >
          <button
            onClick={() => navigate("/uap/cadastro")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Cadastrar nova UAP
          </button>
        </PageHeader>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={() => {
            // Implementar filtros
          }}
        />

        {/* Main Content */}
        <div className="flex gap-6">
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={uaps.map((uap) => ({
                id: uap.id,
                name: uap.name,
                location: uap.location,
                area: `${uap.area} ha`,
                responsible: uap.responsible,
                // A COLUNA 'actions' FOI REMOVIDA DESTE MAP, pois será usada em renderActions
              }))}
              className="border-agro-200"
              // CONFLITO 2 RESOLVIDO: Mantenho o novo prop 'renderActions' da main
              // e adapto o seu conteúdo (botões) da sua branch (samille).
              renderActions={(uap) => (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => navigate(`/uap/editar/${uap.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Editar"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(uap.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                    title="Excluir"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </SideMenu>
  );
}

export default UapPage;


// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { SideMenu } from "../../../components/layout/SideMenu";
// import { PageHeader } from "../../../components/ui/PageHeader";
// import { FilterBar } from "../../../components/ui/FilterBar";
// import { DataTable } from "../../../components/ui/DataTable";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { useUap } from "@/hooks/useUap";

// function UapPage() {
//   const navigate = useNavigate();
//   const { uaps, loading, error, fetchUaps, deleteUap } = useUap();

//   useEffect(() => {
//     fetchUaps();
//   }, [fetchUaps]);

//   const handleDelete = async (uapId: string) => {
//     if (window.confirm("Tem certeza que deseja excluir esta UAP?")) {
//       try {
//         await deleteUap(uapId);
//       } catch {
//         // erro tratado pelo hook
//       }
//     }
//   };

//   // Todas as colunas centralizadas
//   const columns = [
// <<<<<<< samille
//     { key: "name", label: "UAP" },
//     { key: "location", label: "LOCALIZAÇÃO" },
//     { key: "area", label: "ÁREA" },
//     { key: "responsible", label: "RESPONSÁVEL" },
//     { key: "actions", label: "AÇÕES" }, // 👈 nova coluna para os botões
// =======
//     { key: "name", label: "UAP", align: "center" },
//     { key: "location", label: "LOCALIZAÇÃO", align: "center" },
//     { key: "area", label: "ÁREA", align: "center" },
//     { key: "responsible", label: "RESPONSÁVEL", align: "center" },
// >>>>>>> main
//   ];

//   const filters = [
//     {
//       key: "location",
//       label: "Localização",
//       options: [
//         { value: "norte", label: "Seção Norte" },
//         { value: "sul", label: "Seção Sul" },
//         { value: "leste", label: "Seção Leste" },
//         { value: "oeste", label: "Seção Oeste" },
//         { value: "central", label: "Seção Central" },
//         { value: "nordeste", label: "Seção Nordeste" },
//       ],
//       placeholder: "Filtrar por localização",
//     },
//   ];

//   if (loading) {
//     return (
//       <SideMenu title="UNIDADES DE PRODUÇÃO">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
//             <p className="text-neutral-600">Carregando UAPs...</p>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   if (error) {
//     return (
//       <SideMenu title="UNIDADES DE PRODUÇÃO">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <p className="text-red-600 mb-4">Erro ao carregar UAPs: {error}</p>
//             <button onClick={() => fetchUaps()} className="btn-primary">
//               Tentar novamente
//             </button>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   return (
//     <SideMenu title="UNIDADES DE PRODUÇÃO">
//       <div className="space-y-6">
//         {/* Header */}
//         <PageHeader
//           title="Unidades de Produção"
//           subtitle="Gerencie suas unidades de produção"
//         >
//           <button
//             onClick={() => navigate("/uap/cadastro")}
//             className="btn-primary flex items-center gap-2"
//           >
//             <FaPlus size={14} />
//             Cadastrar nova UAP
//           </button>
//         </PageHeader>

//         {/* Filters */}
//         <FilterBar
//           filters={filters}
//           onFilterChange={() => {
//             // Implementar filtros
//           }}
//         />

//         {/* Main Content */}
//         <div className="flex gap-6">
//           <div className="flex-1">
//             <DataTable
//               columns={columns}
//               data={uaps.map((uap) => ({
//                 id: uap.id,
//                 name: uap.name,
//                 location: uap.location,
//                 area: `${uap.area} ha`,
//                 responsible: uap.responsible,
//                 actions: (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => navigate(`/uap/editar/${uap.id}`)}
//                       className="btn-primary p-1 rounded"
//                       title="Editar"
//                     >
//                       <FaEdit size={12} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(uap.id)}
//                       className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                       title="Excluir"
//                     >
//                       <FaTrash size={12} />
//                     </button>
//                   </div>
//                 ),
//               }))}
//               className="border-agro-200"
// <<<<<<< samille
// =======
//               renderActions={(uap) => (
//                 <div className="flex gap-2 justify-center">
//                   <button
//                     onClick={() => navigate(`/uap/editar/${uap.id}`)}
//                     className="btn-primary p-1 rounded"
//                     title="Editar"
//                   >
//                     <FaEdit size={12} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(uap.id)}
//                     className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                     title="Excluir"
//                   >
//                     <FaTrash size={12} />
//                   </button>
//                 </div>
//               )}
// >>>>>>> main
//             />
//           </div>
//         </div>
//       </div>
//     </SideMenu>
//   );
// }

// export default UapPage;
