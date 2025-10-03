
import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination"; // CONFLITO 1 RESOLVIDO: Mantenho o import da Paginação que estava na sua branch (samille)
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useProduct } from "@/hooks/useProduct";
// IMPORTANTE: Adicionar o useQuery se for o novo padrão do projeto
// import { useQuery } from "@tanstack/react-query";

function ProdutosPage() {
  const navigate = useNavigate();

  // CONFLITO DE DADOS (FORA DOS MARCADORES, MAS NECESSÁRIO)
  // Assumo que o projeto está migrando para useQuery e que você precisa manter as funções de ação.
  // Se o projeto AINDA não migrou para useQuery, desconsidere o bloco abaixo e mantenha apenas o seu useProduct original.
  
  // Opção A: Mantendo o seu useProduct (se a main não migrou de fato)
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

  // Opção B: Combinando seu hook com o useQuery (novo padrão)
  /*
  const { deleteProduct, refreshProducts, setPage } = useProduct();
  
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => refreshProducts(),
  });

  const products = productsData?.items || [];
  const loading = isLoading;
  const error = productsData?.error; // Ajuste conforme seu hook
  // Paginação precisa ser ajustada dependendo de onde as variáveis vêm
  const currentPage = productsData?.currentPage || 1;
  const totalPages = productsData?.totalPages || 1;
  const itemsPerPage = productsData?.itemsPerPage || 10;
  const totalItems = productsData?.totalItems || 0;
  */
  // VOU MANTER O BLOCO ORIGINAL DO useProduct, pois não há marcadores de conflito aqui,
  // mas lembre-se de que se o projeto migrou para useQuery, o código precisa ser alterado manualmente,
  // como mostrei na Opção B.

  const handleDelete = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId);
      } catch {
        // erro tratado
      }
    }
  };

  // CONFLITO 2 RESOLVIDO: Combino a estrutura da 'main' (com 'align: center')
  // e adiciono a coluna 'actions' da sua branch (samille).
  const columns = [
    { key: "name", label: "NOME", align: "center" },
    { key: "category", label: "CATEGORIA", align: "center" },
    { key: "quantity", label: "QUANTIDADE", align: "center" },
    { key: "price", label: "PREÇO", align: "center" },
    { key: "status", label: "STATUS", align: "center" },
    { key: "actions", label: "AÇÕES", align: "center" }, // Mantém a coluna de ações da sua branch
  ];

  // Filtros... (sem conflitos)

  if (loading) {
    // ...
  }

  if (error) {
    // ...
  }

  return (
    <SideMenu title="PRODUTOS">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
        // ...
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
        // ...
        />

        {/* Main Content */}
        <div className="flex gap-6">
          <div className="flex-1">
            <DataTable
              columns={columns}
              // O map na sua branch estava criando a coluna 'actions'
              data={products.map((product) => ({
                id: product.id,
                name: product.name,
                category: product.category || "N/A",
                quantity: product.quantity,
                price: `R$ ${product.price.toFixed(2)}`,
                status: product.status,
                // A COLUNA 'actions' FOI REMOVIDA DESTE MAP
              }))}
              className="border-agro-200"
              // CONFLITO 3 RESOLVIDO: Mantenho o novo prop 'renderActions' da main
              // e adapto o seu conteúdo (botões) da sua branch (samille).
              renderActions={(row) => (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/produtos/editar/${row.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Editar"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                    title="Excluir"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              )}
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


// import { useNavigate } from "react-router-dom";
// import { SideMenu } from "@/components/layout/SideMenu";
// import { PageHeader } from "@/components/ui/PageHeader";
// import { FilterBar } from "@/components/ui/FilterBar";
// import { DataTable } from "@/components/ui/DataTable";
// <<<<<<< samille
// import { Pagination } from "@/components/ui/Pagination";
// =======
// >>>>>>> main
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { useProduct } from "@/hooks/useProduct";

// function ProdutosPage() {
//   const navigate = useNavigate();

//   const {
//     products,
//     loading,
//     error,
//     refreshProducts,
//     deleteProduct,
//     currentPage,
//     totalPages,
//     itemsPerPage,
//     totalItems,
//     setPage,
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

//   // Colunas da tabela com alinhamento centralizado
//   const columns = [
// <<<<<<< samille
//     { key: "name", label: "NOME" },
//     { key: "category", label: "CATEGORIA" },
//     { key: "quantity", label: "QUANTIDADE" },
//     { key: "price", label: "PREÇO" },
//     { key: "status", label: "STATUS" },
//     { key: "actions", label: "AÇÕES" }, // nova coluna para botões
// =======
//     { key: "name", label: "NOME", align: "center" },
//     { key: "category", label: "CATEGORIA", align: "center" },
//     { key: "quantity", label: "QUANTIDADE", align: "center" },
//     { key: "price", label: "PREÇO", align: "center" },
//     { key: "status", label: "STATUS", align: "center" },
// >>>>>>> main
//   ];

//   // Filtros
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
//                 actions: (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => navigate(`/produtos/editar/${product.id}`)}
//                       className="btn-primary p-1 rounded"
//                       title="Editar"
//                     >
//                       <FaEdit size={12} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
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
//               renderActions={(row) => (
//                 <div className="flex justify-center gap-2">
//                   <button
//                     onClick={() => navigate(`/produtos/editar/${row.id}`)}
//                     className="btn-primary p-1 rounded"
//                     title="Editar"
//                   >
//                     <FaEdit size={12} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(row.id)}
//                     className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                     title="Excluir"
//                   >
//                     <FaTrash size={12} />
//                   </button>
//                 </div>
//               )}
// >>>>>>> main
//             />
//             {/* Paginação */}
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
//         </div>
//       </div>
//     </SideMenu>
//   );
// }

// export default ProdutosPage;
