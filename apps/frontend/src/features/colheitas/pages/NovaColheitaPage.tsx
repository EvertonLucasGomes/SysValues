import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/PageHeader";
import { FaLeaf, FaTimes } from "react-icons/fa";
import { useHarvest } from "@/hooks/useHarvest";
import { useUap } from "@/hooks/useUap"; // 1. ADICIONADO: Hook para buscar UAPs

function NovaColheitaPage() {
  const navigate = useNavigate();
  const { createHarvest, loading, error } = useHarvest();
    
  // 2. ADICIONADO A4: Desestrutura o hook de UAP
  const { uaps, fetchUaps } = useUap(); 

  const [formData, setFormData] = useState({
    harvestDate: new Date().toISOString().split("T")[0],
    product: "",
    quantity: "",
    unit: "",
    uap: "", // Este campo será preenchido com o ID da UAP dinâmica
    responsible: "",
    cycle: "",
    status: "SCHEDULED",
    equipment: "",
    observations: "",
  });
    
  // 3. ADICIONADO A4: Efeito para carregar as UAPs
  useEffect(() => {
    fetchUaps();
  }, [fetchUaps]);

  // 4. NOVO: Handler unificado para atualizar o state corretamente
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
    
  return (
    <SideMenu title="COLHEITA">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader
          title="Nova Colheita"
          subtitle="Registre uma nova colheita"
        />

        {/* Form */}
        <div className="card p-8 border-agro-200">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await createHarvest({
                  harvestDate: formData.harvestDate,
                  product: formData.product,
                  quantity: parseFloat(formData.quantity),
                  unit: formData.unit,
                  uap: formData.uap,
                  responsible: formData.responsible,
                  cycle: formData.cycle,
                  status: formData.status,
                  equipment: formData.equipment || undefined,
                  observations: formData.observations || undefined,
                });
                navigate("/colheita");
              } catch {
                // erro tratado pelo hook
              }
            }}
          >
            {/* Data */}
            <FormField label="DATA" required>
              <input
                type="date"
                name="harvestDate" // Adicionado name
                className="input-field"
                value={formData.harvestDate}
                // Usando o handler unificado
                onChange={handleInputChange} 
              />
            </FormField>

            {/* Produto */}
            <FormField label="PRODUTO" required>
              <select
                className="input-field"
                name="product" // Adicionado name
                value={formData.product}
                // Usando o handler unificado
                onChange={handleInputChange} 
              >
                <option value="">Selecione um produto</option>
                <option value="Soja Grão">Soja Grão</option>
                <option value="Milho Verde">Milho Verde</option>
                <option value="Feijão Carioca">Feijão Carioca</option>
                <option value="Arroz Branco">Arroz Branco</option>
                <option value="Trigo">Trigo</option>
                <option value="Café Arábica">Café Arábica</option>
                <option value="Algodão">Algodão</option>
                <option value="Cana-de-açúcar">Cana-de-açúcar</option>
              </select>
            </FormField>

            {/* Quantidade */}
            <FormField label="QUANTIDADE" required>
              <input
                type="number"
                className="input-field"
                placeholder="0"
                name="quantity" // Adicionado name
                min="0"
                step="0.01"
                value={formData.quantity}
                // Usando o handler unificado
                onChange={handleInputChange} 
              />
            </FormField>

            {/* Unidade */}
            <FormField label="UNIDADE" required>
              <select
                className="input-field"
                name="unit" // Adicionado name
                value={formData.unit}
                // Usando o handler unificado
                onChange={handleInputChange} 
              >
                <option value="">Selecione a unidade</option>
                <option value="kg">Quilogramas (kg)</option>
                <option value="ton">Toneladas (ton)</option>
                <option value="saca">Sacas (60kg)</option>
                <option value="litro">Litros (L)</option>
                <option value="metro">Metros Cúbicos (m³)</option>
              </select>
            </FormField>

            {/* Ciclo */}
            <FormField label="CICLO" required>
              <select
                className="input-field"
                name="cycle" // Adicionado name
                value={formData.cycle}
                // Usando o handler unificado
                onChange={handleInputChange} 
              >
                <option value="">Selecione o ciclo</option>
                <option value="Verão">Verão</option>
                <option value="Inverno">Inverno</option>
                <option value="Safrinha">Safrinha</option>
                <option value="Perene">Perene</option>
              </select>
            </FormField>

            {/* UAP - MODIFICADO A4 */}
            <FormField label="UAP" required>
              <select
                className="input-field"
                name="uap" // Adicionado name
                value={formData.uap}
                // Usando o handler unificado
                onChange={handleInputChange} 
              >
                <option value="">Selecione a UAP</option>
                {/* 5. Mapeamento Dinâmico das UAPs Cadastradas */}
                {uaps.map((uap) => (
                    <option key={uap.id} value={uap.id}>
                        {uap.name} - {uap.location}
                    </option>
                ))}
              </select>
            </FormField>

            {/* Responsável */}
            <FormField label="RESPONSÁVEL" required>
              <input
                type="text"
                className="input-field"
                placeholder="Nome do responsável"
                name="responsible" // Adicionado name
                value={formData.responsible}
                // Usando o handler unificado
                onChange={handleInputChange} 
              />
            </FormField>

            {/* Equipamento */}
            <FormField label="EQUIPAMENTO" required>
              <select
                className="input-field"
                name="equipment" // Adicionado name
                value={formData.equipment}
                // Usando o handler unificado
                onChange={handleInputChange} 
              >
                <option value="">Selecione o equipamento</option>
                <option value="Colheitadeira">Colheitadeira</option>
                <option value="Trator">Trator</option>
                <option value="Manual">Manual</option>
                <option value="Outro">Outro</option>
              </select>
            </FormField>

            {/* Observações */}
            <div className="md:col-span-2">
              <FormField label="OBSERVAÇÕES">
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Informações adicionais sobre a colheita..."
                name="observations" // Adicionado name
                  value={formData.observations}
                // Usando o handler unificado
                  onChange={handleInputChange} 
                />
              </FormField>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex justify-center gap-4 pt-4">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    REGISTRANDO...
                  </>
                ) : (
                  <>
                    <FaLeaf size={16} />
                    REGISTRAR COLHEITA
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn-secondary flex items-center gap-2"
                onClick={() => navigate("/colheita")}
              >
                <FaTimes size={16} />
                CANCELAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </SideMenu>
  );
}

export default NovaColheitaPage;