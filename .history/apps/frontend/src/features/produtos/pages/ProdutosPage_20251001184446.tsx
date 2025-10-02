import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useProduct } from "@/hooks/useProduct";

function ProdutosPage() {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts, deleteProduct } =
    useProduct();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId);
      } catch {
        // erro tratado
      }
    }
  };

  // Colunas da tabela com alinhamento centralizado
  const columns = [
    { key: "name", label: "NOME", align: "center" },
    { key: "category", label: "CATEGORIA", align: "center" },
    { key: "quantity", label: "QUANTIDADE", align: "center" },
    { key: "price", label: "PREÇO", align: "center" },
    { key: "status", label: "STATUS", align: "center" },
  ];

  // Filtros
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
            <button onClick={() => fetchProducts()} className="btn-primary">
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
              }))}
              className="border-agro-200"
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
          </div>
        </div>
      </div>
    </SideMenu>
  );
}

export default ProdutosPage;
