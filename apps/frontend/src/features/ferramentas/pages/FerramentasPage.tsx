import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import { SideMenu } from "@/components/layout/SideMenu";
import { toolService, authService, type Tool } from "@/services/api";
import { routes } from "@/routes/routes";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { FaTools, FaEdit, FaTrash, FaHandshake, FaUndo } from "react-icons/fa";

function FerramentasPage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const canManageTools =
    authService.hasPermission("CREATE_TOOL") || authService.isAdmin();

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let toolsData: Tool[];
      if (filter) {
        toolsData = await toolService.getToolsByStatus(filter);
      } else {
        toolsData = await toolService.getAllTools();
      }

      setTools(toolsData);
    } catch {
      setError("Erro ao carregar ferramentas");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const handleFilterChange = async (newFilter: string) => {
    setFilter(newFilter);
    try {
      setLoading(true);
      let toolsData: Tool[];
      if (newFilter) {
        toolsData = await toolService.getToolsByStatus(newFilter);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RETURNED":
        return "text-green-600 bg-green-100";
      case "LENDING":
        return "text-red-600 bg-red-100";
      case "REQUESTED":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "RETURNED":
        return "Disponível";
      case "LENDING":
        return "Emprestada";
      case "REQUESTED":
        return "Solicitada";
      default:
        return status;
    }
  };

  const actions = [
    {
      label: "SOLICITAR",
      onClick: () => navigate(routes.navigation.solicitarFerramenta),
      variant: "primary" as const,
      icon: <FaHandshake size={14} />,
    },
    {
      label: "DEVOLVER",
      onClick: () => navigate(routes.navigation.devolverFerramenta),
      variant: "primary" as const,
      icon: <FaUndo size={14} />,
    },
    ...(canManageTools
      ? [
          {
            label: "EDITAR",
            onClick: () => navigate(routes.navigation.editarFerramenta),
            variant: "primary" as const,
            icon: <FaEdit size={14} />,
          },
          {
            label: "EXCLUIR",
            onClick: () => navigate(routes.navigation.excluirFerramenta),
            variant: "danger" as const,
            icon: <FaTrash size={14} />,
          },
        ]
      : []),
  ];

  return (
    <SideMenu title="FERRAMENTAS">
      <div className="flex justify-center items-center h-full w-full gap-6">
        {/* Área da tabela */}
        <div className="bg-[#f4f8ee] p-6 rounded-2xl shadow-md w-full max-w-4xl">
          {/* Filtros e botão de cadastrar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Todos os status</option>
                <option value="RETURNED">Disponível</option>
                <option value="LENDING">Emprestada</option>
                <option value="REQUESTED">Solicitada</option>
              </select>
              <button
                onClick={fetchTools}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Atualizar
              </button>
            </div>

            {canManageTools && (
              <button
                onClick={() => navigate(routes.navigation.cadastroFerramenta)}
                className="btn-primary flex items-center gap-2"
              >
                <FaTools size={14} />
                Cadastrar Ferramenta
              </button>
            )}
          </div>

          {/* Tabela de ferramentas */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b5e1f]"></div>
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
              <table className="min-w-full text-center border-collapse">
                <thead className="bg-[#eaf4e1] text-[#1b5e1f] font-bold">
                  <tr>
                    <th className="py-3 px-4 border">NOME</th>
                    <th className="py-3 px-4 border">STATUS</th>
                    <th className="py-3 px-4 border">RESPONSÁVEL</th>
                    {canManageTools && (
                      <th className="py-3 px-4 border">AÇÕES</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white text-[#1b5e1f]">
                  {tools.length === 0 ? (
                    <tr>
                      <td
                        colSpan={canManageTools ? 4 : 3}
                        className="py-8 text-gray-500"
                      >
                        Nenhuma ferramenta encontrada
                      </td>
                    </tr>
                  ) : (
                    tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border font-medium">
                          {tool.toolName}
                        </td>
                        <td className="py-3 px-4 border">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              tool.status
                            )}`}
                          >
                            {getStatusText(tool.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 border">
                          {tool.responsiblePerson || "-"}
                        </td>
                        {canManageTools && (
                          <td className="py-3 px-4 border">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() =>
                                  navigate(
                                    `${routes.navigation.editarFerramenta}?id=${tool.id}`
                                  )
                                }
                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `${routes.navigation.excluirFerramenta}?id=${tool.id}`
                                  )
                                }
                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Área de AÇÕES
        <ActionButtons
          actions={actions}
          title="AÇÕES"
          className="border-agro-200"
        /> */}
      </div>
    </SideMenu>
  );
}

export default FerramentasPage;
