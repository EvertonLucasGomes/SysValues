// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { SideMenu } from "@/components/layout/SideMenu";
// import { PageHeader } from "@/components/ui/PageHeader";
// import { FilterBar } from "@/components/ui/FilterBar";
// import { DataTable } from "@/components/ui/DataTable";
// import { Pagination } from "@/components/ui/Pagination"; // <-- NOVO: Componente de Paginação
// import { ActionButtons } from "@/components/ui/ActionButtons";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { useProduct } from "@/hooks/useProduct";

// function ProdutosPage() {
//   const navigate = useNavigate();
  
//   // CORREÇÃO 1: Desestruturar os dados de paginação do hook genérico
//   const { 
//     products, 
//     loading, 
//     error, 
//     // fetchProducts, <-- REMOVIDO: Usamos refreshProducts
//     refreshProducts, // <-- NOVO: Função para recarregar
//     deleteProduct,
//     // NOVO: Estados de Paginação
//     currentPage, 
//     totalPages, 
//     itemsPerPage, 
//     totalItems, 
//     setPage 
//   } = useProduct(); 

//   const handleDelete = async (productId: string) => {
//     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
//       try {
//         await deleteProduct(productId);
//       } catch {
//         // erro tratado
//       }
//     }
//   };

//   const columns = [
//     { key: "name", label: "NOME" },
//     { key: "category", label: "CATEGORIA" },
//     { key: "quantity", label: "QUANTIDADE" },
//     { key: "price", label: "PREÇO" },
//     { key: "status", label: "STATUS" },
//   ];

//   const filters = [
//     {
//       key: "category",
//       label: "Categoria",
//       options: [
//         { value: "semente", label: "Semente" },
//         { value: "muda", label: "Muda" },
//         { value: "fertilizante", label: "Fertilizante" },
//         { value: "defensivo", label: "Defensivo" },
//       ],
//       placeholder: "Filtrar por categoria",
//     },
//     {
//       key: "status",
//       label: "Status",
//       options: [
//         { value: "DISPONIVEL", label: "Disponível" },
//         { value: "ESGOTADO", label: "Esgotado" },
//         { value: "BAIXO_ESTOQUE", label: "Baixo Estoque" },
//       ],
//       placeholder: "Filtrar por status",
//     },
//   ];

//   const actions = [
//     {
//       label: "EDITAR",
//       onClick: () => navigate("/produtos/editar"),
//       variant: "primary" as const,
//       icon: <FaEdit size={14} />,
//     },
//     {
//       label: "EXCLUIR",
//       onClick: () => {
//         // Implementar ação de exclusão
//       },
//       variant: "danger" as const,
//       icon: <FaTrash size={14} />,
//     },
//   ];

//   if (loading) {
//     return (
//       <SideMenu title="PRODUTOS">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
//             <p className="text-neutral-600">Carregando produtos...</p>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   if (error) {
//     return (
//       <SideMenu title="PRODUTOS">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <p className="text-red-600 mb-4">
//               Erro ao carregar produtos: {error}
//             </p>
//             {/* CORREÇÃO 3: Chama refreshProducts */}
//             <button onClick={() => refreshProducts()} className="btn-primary">
//               Tentar novamente
//             </button>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   return (
//     <SideMenu title="PRODUTOS">
//       <div className="space-y-6">
//         {/* Header */}
//         <PageHeader
//           title="Produtos Agropecuários"
//           subtitle="Controle de produtos do sistema"
//         >
//           <button
//             onClick={() => navigate("/produtos/cadastro")}
//             className="btn-primary flex items-center gap-2"
//           >
//             <FaPlus size={14} />
//             Cadastrar novo produto
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
//           {/* Tabela */}
//           <div className="flex-1">
//             <DataTable
//               columns={columns}
//               data={products.map((product) => ({
//                 id: product.id,
//                 name: product.name,
//                 category: product.category || "N/A",
//                 quantity: product.quantity,
//                 price: `R$ ${product.price.toFixed(2)}`,
//                 status: product.status,
//               }))}
//               className="border-agro-200"
//               actions={
//                 <div className="flex gap-2">
//                   {products.map((product) => (
//                     <div key={product.id} className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           navigate(`/produtos/editar/${product.id}`)
//                         }
//                         className="btn-primary p-1 rounded"
//                         title="Editar"
//                       >
//                         <FaEdit size={12} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                         title="Excluir"
//                       >
//                         <FaTrash size={12} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               }
//             />
//             {/* CORREÇÃO 4: Renderiza o componente de Paginação */}
//             <div className="mt-4">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 totalItems={totalItems}
//                 itemsPerPage={itemsPerPage}
//                 onPageChange={setPage}
//               />
//             </div>
//           </div>

//           {/* Ações
//           <ActionButtons
//             actions={actions}
//             title="AÇÕES"
//             className="border-agro-200"
//           /> */}
//         </div>
//       </div>
//     </SideMenu>
//   );
// }

// export default ProdutosPage;


import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useProduct } from "@/hooks/useProduct";

function ProdutosPage() {
  const navigate = useNavigate();

  const {
    products,
    loading,
    error,
    refreshProducts,
    deleteProduct,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
  } = useProduct();

  const handleDelete = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId);
      } catch {
        // erro tratado
      }
    }
  };

  const columns = [
    { key: "name", label: "NOME" },
    { key: "category", label: "CATEGORIA" },
    { key: "quantity", label: "QUANTIDADE" },
    { key: "price", label: "PREÇO" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "AÇÕES" }, // nova coluna para botões
  ];

  const filters = [
    {
      key: "category",
      label: "Categoria",
      options: [
        { value: "semente", label: "Semente" },
        { value: "muda", label: "Muda" },
        { value: "fertilizante", label: "Fertilizante" },
        { value: "defensivo", label: "Defensivo" },
      ],
      placeholder: "Filtrar por categoria",
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "DISPONIVEL", label: "Disponível" },
        { value: "ESGOTADO", label: "Esgotado" },
        { value: "BAIXO_ESTOQUE", label: "Baixo Estoque" },
      ],
      placeholder: "Filtrar por status",
    },
  ];

  if (loading) {
    return (
      <SideMenu title="PRODUTOS">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando produtos...</p>
          </div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    return (
      <SideMenu title="PRODUTOS">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Erro ao carregar produtos: {error}
            </p>
            <button onClick={() => refreshProducts()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  return (
    <SideMenu title="PRODUTOS">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Produtos Agropecuários"
          subtitle="Controle de produtos do sistema"
        >
          <button
            onClick={() => navigate("/produtos/cadastro")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Cadastrar novo produto
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
          {/* Tabela */}
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={products.map((product) => ({
                id: product.id,
                name: product.name,
                category: product.category || "N/A",
                quantity: product.quantity,
                price: `R$ ${product.price.toFixed(2)}`,
                status: product.status,
                actions: (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/produtos/editar/${product.id}`)}
                      className="btn-primary p-1 rounded"
                      title="Editar"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      title="Excluir"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ),
              }))}
              className="border-agro-200"
            />
            {/* Paginação */}
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </SideMenu>
  );
}

export default ProdutosPage;
