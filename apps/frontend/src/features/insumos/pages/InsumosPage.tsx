import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination"; // Componente de Paginação

import { FaPlus } from "react-icons/fa";
// CORREÇÃO: O hook se chama useInsumos. Removemos a importação do useState e useEffect manuais
import useInsumos  from "@/hooks/useInsumo"; 

function InsumosPage() {
  const navigate = useNavigate();

  // DESESTRUTURANDO O HOOK GENÉRICO: Ele fornece o estado de paginação e as funções
  const { 
    insumos, 
    loading, 
    error,
    currentPage, 
    totalPages, 
    itemsPerPage, 
    totalItems, 
    setPage, // Função para mudar a página
    refreshInsumos // Função refresh
  } = useInsumos();

  // As declarações de page, limit e o useEffect manual foram REMOVIDAS
  
  const columns = [
    { key: "name", label: "NOME" },
    { key: "type", label: "TIPO" },
    { key: "amount", label: "QUANTIDADE" },
    { key: "unit", label: "UNIDADE" },
    { key: "supplier", label: "FORNECEDOR" },
    { key: "expiryDate", label: "VALIDADE" },
  ];

  const filters = [
    {
      key: "type",
      label: "Tipo",
      options: [
        { value: "fertilizante", label: "Fertilizante" },
        { value: "defensivo", label: "Defensivo" },
        { value: "corretivo", label: "Corretivo" },
        { value: "semente", label: "Semente" },
        { value: "outro", label: "Outro" },
      ],
      placeholder: "Filtrar por tipo",
    },
  ];

  if (loading) {
    // ... (Retorno loading está OK)
    return (
      <SideMenu title="Insumos Agropecuários">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando insumos...</p>
          </div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    // ... (Retorno error)
    return (
      <SideMenu title="Insumos Agropecuários">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Erro ao carregar insumos: {error}
            </p>
            <button onClick={() => refreshInsumos()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  return (
    <SideMenu title="Insumos Agropecuários">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Insumos Agropecuários"
          subtitle="Controle de fertilizantes, defensivos e corretivos"
        >
          <button
            onClick={() => navigate("/insumos/cadastro")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Cadastrar novo insumo
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
              data={insumos.map((insumo) => ({
                id: insumo.id,
                name: insumo.name,
                type: insumo.type,
                amount: insumo.amount,
                unit: insumo.unit,
                supplier: insumo.supplier || "-",
                expiryDate: insumo.expiryDate
                  ? new Date(insumo.expiryDate).toLocaleDateString("pt-BR")
                  : "-",
              }))}
              className="border-agro-200"
            />
            
            {/* INSERINDO O COMPONENTE DE PAGINAÇÃO PADRÃO (B3) */}
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

export default InsumosPage;


