import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SideMenu } from "../../../components/layout/SideMenu";
import { PageHeader } from "../../../components/ui/PageHeader";
import { FilterBar } from "../../../components/ui/FilterBar";
import { DataTable } from "../../../components/ui/DataTable";
import {
  FaPlus,
  FaEye,
  FaTrash,
  FaDollarSign,
  FaFileAlt,
  FaSearch,
} from "react-icons/fa";
import { useSales } from "../../../hooks/useSales";

function VendasPage() {
  const navigate = useNavigate();
  const { sales, loading, error, fetchSales, deleteSale } = useSales();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleDelete = async (saleId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        await deleteSale(saleId);
      } catch {
        // erro tratado
      }
    }
  };

  // Transformar dados das vendas para o formato da tabela
  const vendasData = sales.map((sale) => ({
    id: sale.id,
    data: new Date(sale.saleDate).toLocaleDateString("pt-BR"),
    cliente: sale.uap?.responsible || "Cliente não identificado",
    produto: sale.saleItems
      .map((item) => `${item.product.name} (${item.quantity} un)`)
      .join(", "),
    quantidade: sale.saleItems
      .reduce((total, item) => total + item.quantity, 0)
      .toString(),
    valor: `R$ ${sale.totalAmount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`,
    status:
      sale.status === "COMPLETED"
        ? "Concluída"
        : sale.status === "PENDING"
        ? "Pendente"
        : "Cancelada",
  }));

  const columns = [
    { key: "id", label: "N° Venda", align: "center" },
    { key: "data", label: "Data", align: "center" },
    { key: "cliente", label: "Cliente", align: "center" },
    { key: "produto", label: "Produto", align: "center" },
    { key: "quantidade", label: "Quantidade", align: "center" },
    { key: "valor", label: "Valor", align: "center" },
    { key: "status", label: "Status", align: "center" },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "COMPLETED", label: "Concluída" },
        { value: "PENDING", label: "Pendente" },
        { value: "CANCELLED", label: "Cancelada" },
      ],
      placeholder: "Filtrar por status",
    },
  ];

  const totalVendas = sales
    .filter((sale) => sale.status === "COMPLETED")
    .reduce((total, sale) => total + sale.totalAmount, 0);

  const vendasMes = sales.filter((sale) => sale.status === "COMPLETED").length;
  const ticketMedio = vendasMes > 0 ? totalVendas / vendasMes : 0;

  if (loading) {
    return (
      <SideMenu title="Vendas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando vendas...</p>
          </div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    return (
      <SideMenu title="Vendas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Erro ao carregar vendas: {error}
            </p>
            <button onClick={() => fetchSales()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  return (
    <SideMenu title="Vendas">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Gestão de Vendas"
          subtitle="Controle completo de vendas e receita"
        >
          <button
            onClick={() => navigate("/vendas/registrar")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Nova Venda
          </button>
        </PageHeader>

        {/* Filters */}
        <FilterBar filters={filters}>
          <button className="btn-secondary flex items-center gap-2">
            <FaSearch size={14} />
            Buscar
          </button>
        </FilterBar>

        {/* Tabela de Vendas */}
        <div className="flex gap-6">
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={vendasData}
              className="border-agro-200"
              renderActions={(row) => (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/vendas/visualizar/${row.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Visualizar"
                  >
                    <FaEye size={12} />
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

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-agro">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-agro-600">
                  Total de Vendas
                </p>
                <p className="text-2xl font-bold text-agro-700">
                  R${" "}
                  {totalVendas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-3 bg-agro-100 rounded-lg border border-agro-200">
                <FaDollarSign className="text-agro-600" size={20} />
              </div>
            </div>
          </div>

          <div className="card-agro">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-agro-600">
                  Vendas do Mês
                </p>
                <p className="text-2xl font-bold text-agro-700">{vendasMes}</p>
              </div>
              <div className="p-3 bg-wheat-100 rounded-lg border border-wheat-200">
                <FaFileAlt className="text-wheat-600" size={20} />
              </div>
            </div>
          </div>

          <div className="card-agro">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-agro-600">
                  Ticket Médio
                </p>
                <p className="text-2xl font-bold text-agro-700">
                  R${" "}
                  {ticketMedio.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-3 bg-earth-100 rounded-lg border border-earth-200">
                <FaDollarSign className="text-earth-600" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenu>
  );
}

export default VendasPage;
