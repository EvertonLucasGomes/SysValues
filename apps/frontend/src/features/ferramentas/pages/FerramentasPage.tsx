
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { toolService, authService, type Tool } from "@/services/api";
import { routes } from "@/routes/routes";
import { FaTools, FaEdit, FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

function FerramentasPage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canManageTools =
    authService.hasPermission("CREATE_TOOL") || authService.isAdmin();

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const toolsData: Tool[] = await toolService.getAllTools();
      setTools(toolsData);
    } catch {
      setError("Erro ao carregar ferramentas");
    } finally {
      setLoading(false);
    }
  }, []);

  useQuery({
    queryKey: ["ferramentas"],
    queryFn: () => fetchTools(),
  });

  const handleFilterChange = async (key: string, value: string) => {
    try {
      setLoading(true);
      let toolsData: Tool[];
      if (value) {
        toolsData = await toolService.getToolsByStatus(value);
      } else {
        toolsData = await toolService.getAllTools();
      }
      setTools(toolsData);
    } catch {
      setError("Erro ao filtrar ferramentas");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "toolName", label: "NOME" },
    { key: "status", label: "STATUS" },
    { key: "responsiblePerson", label: "RESPONSÁVEL" },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "RETURNED", label: "Disponível" },
        { value: "LENDING", label: "Emprestada" },
        { value: "REQUESTED", label: "Solicitada" },
      ],
      placeholder: "Filtrar por status",
    },
  ];

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const paginatedData = tools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <SideMenu title="FERRAMENTAS">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Gestão de Ferramentas"
          subtitle="Controle e acompanhamento das ferramentas"
        >
          {canManageTools && (
            <button
              onClick={() => navigate(routes.navigation.cadastroFerramenta)}
              className="btn-primary flex items-center gap-2"
            >
              <FaTools size={14} />
              Cadastrar Ferramenta
            </button>
          )}
        </PageHeader>

        {/* Filtros */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Conteúdo principal */}
        <div className="flex gap-6">
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600"></div>
                <p className="mt-2 text-gray-600">Carregando ferramentas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button onClick={fetchTools} className="btn-primary">
                  Tentar novamente
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={paginatedData.map((tool) => ({
                  toolName: tool.toolName,
                  status:
                    tool.status === "RETURNED"
                      ? "Disponível"
                      : tool.status === "LENDING"
                      ? "Emprestada"
                      : "Solicitada",
                  responsiblePerson: tool.responsiblePerson || "-",
                }))}
                className="border-agro-200"
                actions={
                  canManageTools && (
                    <div className="flex gap-2">
                      {paginatedData.map((tool) => (
                        <div key={tool.id} className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `${routes.navigation.editarFerramenta}?id=${tool.id}`
                              )
                            }
                            className="btn-primary p-1 rounded"
                            title="Editar"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `${routes.navigation.excluirFerramenta}?id=${tool.id}`
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                            title="Excluir"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                }
              />
            )}
          </div>

          {/* Paginação */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={tools.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </SideMenu>
  );
}

export default FerramentasPage;
