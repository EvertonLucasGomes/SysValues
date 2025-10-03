import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
// CORREÇÃO: Importação Padrão do hook (assumindo que o hook usa export default)
import useInsumos from "@/hooks/useInsumo"; 
import { FaSave, FaArrowLeft } from "react-icons/fa";
// Importa o EUnit para tipagem correta no handleSubmit
import type { EUnit } from "@/services/api"; // <-- Importa de um local funcional (API principal)

function CadastroInsumoPage() {
  const navigate = useNavigate();
  
  // USO DO HOOK: useInsumos()
  const { createInsumo, loading, error } = useInsumos();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    unit: "",
    supplier: "",
    expiryDate: "",
    observations: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submetendo formulário:", formData);

    if (
      !formData.name ||
      !formData.type ||
      !formData.amount ||
      !formData.unit
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      console.log("Criando insumo...");
      await createInsumo({
        name: formData.name,
        type: formData.type,
        amount: parseFloat(formData.amount),
        unit: formData.unit as EUnit, // CORREÇÃO DE TIPAGEM FINAL
        supplier: formData.supplier || undefined,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate)
          : undefined,
        observations: formData.observations || undefined,
      });
      console.log("Insumo criado com sucesso!");

      navigate("/insumos");
    } catch (error) {
      console.error("Erro ao criar insumo:", error);
      // erro tratado pelo hook
    }
  };

  return (
    <SideMenu title="CADASTRO DE INSUMO">
      <div className="flex justify-center items-center h-full w-full">
        <div className="bg-[#f4f8ee] p-6 rounded-2xl shadow-md w-full max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/insumos")}
              className="text-[#1b5e1f] hover:text-[#0f3d14] transition-colors"
            >
              <FaArrowLeft size={20} />
            </button>
            <h2 className="text-[#1b5e1f] font-bold text-xl">
              CADASTRO DE INSUMO
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">
                NOME DO INSUMO *
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Digite o nome do insumo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">TIPO *</label>
              <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="fertilizante">Fertilizante</option>
                <option value="defensivo">Defensivo</option>
                <option value="corretivo">Corretivo</option>
                <option value="semente">Semente</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">QUANTIDADE *</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">UNIDADE *</label>
                <select
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="KG">Quilogramas (kg)</option>
                  <option value="LITRO">Litros (L)</option>
                  <option value="UNIDADE">Unidades (un)</option>
                  <option value="SACA">Sacos</option>
                  <option value="CAIXA">Caixas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">FORNECEDOR</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Nome do fornecedor"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                DATA DE VALIDADE
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">OBSERVAÇÕES</label>
              <textarea
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                rows={3}
                placeholder="Observações sobre o insumo..."
                value={formData.observations}
                onChange={(e) =>
                  handleInputChange("observations", e.target.value)
                }
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/insumos")}
                className="btn-secondary"
                disabled={loading}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                <FaSave size={14} />
                {loading ? "CADASTRANDO..." : "CADASTRAR"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SideMenu>
  );
}

export default CadastroInsumoPage;
