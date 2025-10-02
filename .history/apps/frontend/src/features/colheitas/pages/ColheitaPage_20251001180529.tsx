import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useHarvest } from "@/hooks/useHarvest";
import { useQuery } from "@tanstack/react-query";

function ColheitaPage() {
  const navigate = useNavigate();
  const { harvests, loading, error, fetchHarvests, deleteHarvest } =
    useHarvest();

  const { data, isLoading } = useQuery({
    queryKey: ["colheitas"],
    queryFn: () => fetchHarvests(),
  });

  const handleDelete = async (harvestId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta colheita?")) {
      try {
        await deleteHarvest(harvestId);
      } catch {
        // erro tratado
      }
    }
  };

  const columns = [
    { key: "id", label: "N° COLHEITA" },
    { key: "data", label: "DATA" },
    { key: "produto", label: "PRODUTO" },
    { key: "quantidade", label: "QUANTIDADE" },
    { key: "uap", label: "UAP" },
    { key: "responsavel", label: "RESPONSÁVEL" },
    { key: "ciclo", label: "CICLO" },
    { key: "status", label: "STATUS" },
  ];

  const filters = [
    {
      key: "produto",
      label: "Produto",
      options: [
        { value: "soja", label: "Soja Grão" },
        { value: "milho", label: "Milho Verde" },
        { value: "feijao", label: "Feijão Carioca" },
        { value: "arroz", label: "Arroz Branco" },
        { value: "trigo", label: "Trigo" },
        { value: "cafe", label: "Café Arábica" },
        { value: "algodao", label: "Algodão" },
        { value: "cana", label: "Cana-de-açúcar" },
      ],
      placeholder: "Filtrar por produto",
    },
    {
      key: "ciclo",
      label: "Ciclo",
      options: [
        { value: "verao", label: "Verão" },
        { value: "inverno", label: "Inverno" },
        { value: "safrinha", label: "Safrinha" },
        { value: "perene", label: "Perene" },
      ],
      placeholder: "Filtrar por ciclo",
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "concluida", label: "Concluída" },
        { value: "em-andamento", label: "Em Andamento" },
        { value: "agendada", label: "Agendada" },
        { value: "cancelada", label: "Cancelada" },
      ],
      placeholder: "Filtrar por status",
    },
  ];

  if (loading) {
    return (
      <SideMenu title="COLHEITA">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando colheitas...</p>
          </div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    return (
      <SideMenu title="COLHEITA">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Erro ao carregar colheitas: {error}
            </p>
            <button onClick={() => fetchHarvests()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  return (
    <SideMenu title="COLHEITA">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Gestão de Colheitas"
          subtitle="Controle e acompanhamento das colheitas"
        >
          <button
            onClick={() => navigate("/colheita/nova")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Registrar Nova Colheita
          </button>
        </PageHeader>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={(_key, _value) => {
            // Implementar filtros baseados em key e value
          }}
        />

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Tabela */}
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={harvests.map((harvest) => ({
                id: harvest.id,
                data: new Date(harvest.harvestDate).toLocaleDateString("pt-BR"),
                produto: harvest.product,
                quantidade: `${harvest.quantity} ${harvest.unit}`,
                uap: harvest.uap,
                responsavel: harvest.responsible,
                ciclo: harvest.cycle,
                status: harvest.status,
              }))}
              className="border-agro-200"
              actions={(row) => (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/colheita/visualizar/${row.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Visualizar"
                  >
                    <FaEye size={12} />
                  </button>
                  <button
                    onClick={() => navigate(`/colheita/editar/${row.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Editar"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id as string)}
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

export default ColheitaPage;
