import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { FaSave, FaTimes, FaCalendar, FaDollarSign } from "react-icons/fa";
import { useSaleForm } from "@/hooks/useSaleForm";
import { UapSelect } from "@/components/ui/inputs/UapSelect";
import { ProductSelect } from "@/components/ui/inputs/ProductSelect";

export default function VendaCadastroPage() {
  const navigate = useNavigate();
  const { formData, setField, products, uaps, submit, loading, error } =
    useSaleForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.uapId ||
      !formData.produto ||
      !formData.quantidade ||
      !formData.precoUnitario
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    await submit();
    navigate("/vendas");
  };

  return (
    <SideMenu title="Vendas">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Nova Venda"
          subtitle="Preencha os dados para registrar uma nova venda"
        />

        <div className="card p-8 border-agro-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UapSelect
                value={formData.uapId}
                onChange={(v) => setField("uapId", v)}
                uaps={uaps}
              />
              <ProductSelect
                value={formData.produto}
                onChange={(v) => setField("produto", v)}
                products={products}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Quantidade" required>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.quantidade}
                  onChange={(e) => setField("quantidade", e.target.value)}
                />
              </FormField>

              <FormField label="Data da Venda" required>
                <input
                  className="input-field"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Preço Unitário" required>
                <input
                  className="input-field pl-10"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoUnitario}
                  onChange={(e) => setField("precoUnitario", e.target.value)}
                />
              </FormField>

              <FormField label="Desconto (%)">
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.desconto}
                  onChange={(e) => setField("desconto", e.target.value)}
                />
              </FormField>

              <FormField label="Valor Total" required>
                <input
                  className="input-field pl-10 bg-neutral-50"
                  type="text"
                  readOnly
                  value={`R$ ${formData.valorTotal}`}
                />
              </FormField>
            </div>

            {/* Pagamento e Entrega */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Forma de Pagamento" required>
                <select
                  className="input-field"
                  value={formData.formaPagamento}
                  onChange={(e) => setField("formaPagamento", e.target.value)}
                >
                  <option value="">Selecione a forma de pagamento</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cheque">Cheque</option>
                  <option value="cartao">Cartão de Crédito/Débito</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência Bancária</option>
                </select>
              </FormField>

              <FormField label="Condição de Entrega" required>
                <select
                  className="input-field"
                  value={formData.condicaoEntrega}
                  onChange={(e) => setField("condicaoEntrega", e.target.value)}
                >
                  <option value="">Selecione a condição</option>
                  <option value="imediata">Entrega Imediata</option>
                  <option value="agendada">Entrega Agendada</option>
                  <option value="retirada">Retirada no Local</option>
                  <option value="transporte">Transporte Incluso</option>
                </select>
              </FormField>
            </div>

            <FormField label="Observações">
              <textarea
                className="input-field"
                rows={3}
                value={formData.observacoes}
                onChange={(e) => setField("observacoes", e.target.value)}
              />
            </FormField>

            <div className="flex justify-center gap-4 pt-4">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                <FaSave size={16} /> {loading ? "SALVANDO..." : "SALVAR VENDA"}
              </button>
              <button
                type="button"
                className="btn-secondary flex items-center gap-2"
                onClick={() => navigate("/vendas")}
              >
                <FaTimes size={16} /> CANCELAR
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-center mt-4">Erro: {error}</div>
            )}
          </form>
        </div>
      </div>
    </SideMenu>
  );
}
