import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SideMenu } from "../../../components/layout/SideMenu";
import { PageHeader } from "../../../components/ui/PageHeader";
import { FilterBar } from "../../../components/ui/FilterBar";
import { DataTable } from "../../../components/ui/DataTable";
import { ActionButtons } from "../../../components/ui/ActionButtons";
import {
  FaPlus,
  FaEye,
  FaFileAlt,
  FaTrash,
  FaSearch,
  FaDollarSign,
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
    { key: "id", label: "N° Venda" },
    { key: "data", label: "Data" },
    { key: "cliente", label: "Cliente" },
    { key: "produto", label: "Produto" },
    { key: "quantidade", label: "Quantidade" },
    { key: "valor", label: "Valor" },
    { key: "status", label: "Status" },
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

  const actions = [
    {
      label: "Visualizar",
      onClick: () => {
        // Implementar visualização da venda
      },
      variant: "primary" as const,
      icon: <FaEye size={14} />,
    },
    {
      label: "Gerar NF",
      onClick: () => navigate("/vendas/nota"),
      variant: "primary" as const,
      icon: <FaFileAlt size={14} />,
    },
    {
      label: "Excluir",
      onClick: () => {
        // Implementar exclusão da venda
      },
      variant: "danger" as const,
      icon: <FaTrash size={14} />,
    },
  ];

  // Cálculos reais baseados nos dados
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
        {/* Header Actions - Mais institucional */}
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

        {/* Filters - Mais robusto */}
        <FilterBar filters={filters}>
          <button className="btn-secondary flex items-center gap-2">
            <FaSearch size={14} />
            Buscar
          </button>
        </FilterBar>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Tabela de Vendas */}
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={vendasData}
              className="border-agro-200"
              actions={
                <div className="flex gap-2">
                  {sales.map((sale) => (
                    <div key={sale.id} className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/vendas/visualizar/${sale.id}`)
                        }
                        className="btn-primary p-1 rounded"
                        title="Visualizar"
                      >
                        <FaEye size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        title="Excluir"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              }
            />
          </div>

          {/* Painel de Ações
          <ActionButtons
            actions={actions}
            title="AÇÕES"
            className="border-agro-200"
          /> */}
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
