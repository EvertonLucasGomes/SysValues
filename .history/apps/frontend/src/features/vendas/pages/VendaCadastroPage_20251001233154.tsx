import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  FaSave,
  FaTimes,
  FaBox,
  FaCalendar,
  FaDollarSign,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useSales } from "@/hooks/useSales";
import { useProduct } from "@/hooks/useProduct";
import { useUap } from "@/hooks/useUap";

function VendaCadastroPage() {
  const navigate = useNavigate();
  const { createSale, loading, error } = useSales();
  const { products, fetchProducts } = useProduct();
  const { uaps, fetchUaps } = useUap();

  const [formData, setFormData] = useState({
    uapId: "",
    produto: "",
    quantidade: "",
    precoUnitario: "",
    desconto: "",
    valorTotal: "0.00",
    formaPagamento: "",
    condicaoEntrega: "",
    observacoes: "",
  });

  // Buscar produtos e UAPs
  useEffect(() => {
    fetchProducts();
    fetchUaps();
  }, [fetchProducts, fetchUaps]);

  // Atualizar valor total sempre que quantidade, preço ou desconto mudarem
  useEffect(() => {
    const quantidade = parseFloat(formData.quantidade || "0");
    const preco = parseFloat(formData.precoUnitario || "0");
    const desconto = parseFloat(formData.desconto || "0");

    if (!isNaN(quantidade) && !isNaN(preco)) {
      let total = quantidade * preco;
      if (!isNaN(desconto) && desconto > 0) {
        total = total * (1 - desconto / 100);
      }
      setFormData((prev) => ({ ...prev, valorTotal: total.toFixed(2) }));
    }
  }, [formData.quantidade, formData.precoUnitario, formData.desconto]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      // Atualizar precoUnitario se selecionar produto
      if (field === "produto") {
        const product = products.find((p) => p.id === value);
        if (product) {
          next.precoUnitario = product.price.toString();
        }
      }

      return next;
    });
  };

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

    try {
      // calcular unitPrice já com desconto
      const precoComDesconto =
        parseFloat(formData.precoUnitario) *
        (1 - parseFloat(formData.desconto || "0") / 100);

      const saleData = {
        uapId: formData.uapId,
        items: [
          {
            productId: formData.produto,
            quantity: parseInt(formData.quantidade),
            unitPrice: precoComDesconto,
            totalPrice: parseFloat(formData.valorTotal),
          },
        ],
        status: "PENDING",
        saleDate: new Date().toISOString(),
      };

      await createSale(saleData);
      navigate("/vendas");
    } catch (err) {
      console.error("Erro ao criar venda:", err);
    }
  };

  const valorTotal = formData.valorTotal || "0,00";

  return (
    <SideMenu title="Vendas">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Nova Venda"
          subtitle="Preencha os dados para registrar uma nova venda"
        />

        <div className="card p-8 border-agro-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* UAP e Produto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="UAP" required>
                <div className="relative">
                  <FaMapMarkerAlt
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agro-500"
                    size={14}
                  />
                  <select
                    className="input-field pl-10"
                    value={formData.uapId}
                    onChange={(e) => handleInputChange("uapId", e.target.value)}
                  >
                    <option value="">Selecionar UAP...</option>
                    {uaps.map((uap) => (
                      <option key={uap.id} value={uap.id}>
                        {uap.name} - {uap.location}
                      </option>
                    ))}
                  </select>
                </div>
              </FormField>

              <FormField label="Produto" required>
                <div className="relative">
                  <FaBox
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agro-500"
                    size={14}
                  />
                  <select
                    className="input-field pl-10"
                    value={formData.produto}
                    onChange={(e) =>
                      handleInputChange("produto", e.target.value)
                    }
                  >
                    <option value="">Selecionar produto...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - R$ {product.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </FormField>
            </div>

            {/* Quantidade e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Quantidade" required>
                <div className="relative">
                  <input
                    className="input-field pr-12"
                    type="number"
                    placeholder="0"
                    min="0"
                    step="1"
                    value={formData.quantidade}
                    onChange={(e) =>
                      handleInputChange("quantidade", e.target.value)
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-neutral-400 text-sm">un</span>
                  </div>
                </div>
              </FormField>

              <FormField label="Data da Venda" required>
                <div className="relative">
                  <FaCalendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agro-500"
                    size={14}
                  />
                  <input
                    className="input-field pl-10"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </FormField>
            </div>

            {/* Preço, Desconto e Valor Total */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Preço Unitário" required>
                <div className="relative">
                  <FaDollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agro-500"
                    size={14}
                  />
                  <input
                    className="input-field pl-10"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.precoUnitario}
                    onChange={(e) =>
                      handleInputChange("precoUnitario", e.target.value)
                    }
                  />
                </div>
              </FormField>

              <FormField label="Desconto (%)">
                <div className="relative">
                  <input
                    className="input-field pl-3"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.desconto}
                    onChange={(e) =>
                      handleInputChange("desconto", e.target.value)
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-neutral-400 text-sm">%</span>
                  </div>
                </div>
              </FormField>

              <FormField label="Valor Total" required>
                <div className="relative">
                  <FaDollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agro-500"
                    size={14}
                  />
                  <input
                    className="input-field pl-10 bg-neutral-50"
                    type="text"
                    value={`R$ ${valorTotal}`}
                    readOnly
                  />
                </div>
              </FormField>
            </div>

            {/* Pagamento e Entrega */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Forma de Pagamento" required>
                <select
                  className="input-field"
                  value={formData.formaPagamento}
                  onChange={(e) =>
                    handleInputChange("formaPagamento", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("condicaoEntrega", e.target.value)
                  }
                >
                  <option value="">Selecione a condição</option>
                  <option value="imediata">Entrega Imediata</option>
                  <option value="agendada">Entrega Agendada</option>
                  <option value="retirada">Retirada no Local</option>
                  <option value="transporte">Transporte Incluso</option>
                </select>
              </FormField>
            </div>

            {/* Observações */}
            <FormField label="Observações">
              <textarea
                className="input-field"
                rows={3}
                placeholder="Informações adicionais sobre a venda..."
                value={formData.observacoes}
                onChange={(e) =>
                  handleInputChange("observacoes", e.target.value)
                }
              />
            </FormField>

            {/* Botões */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                <FaSave size={16} />
                {loading ? "SALVANDO..." : "SALVAR VENDA"}
              </button>
              <button
                type="button"
                className="btn-secondary flex items-center gap-2"
                onClick={() => navigate("/vendas")}
              >
                <FaTimes size={16} />
                CANCELAR
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-center mt-4">Erro: {error}</div>
            )}
          </form>
        </div>

        {/* Ajuda */}
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Dicas para uma venda eficiente
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Verifique se a UAP está cadastrada no sistema</li>
            <li>• Confirme a disponibilidade do produto em estoque</li>
            <li>• Revise os valores antes de finalizar a venda</li>
            <li>• Adicione observações relevantes para o controle</li>
          </ul>
        </div>
      </div>
    </SideMenu>
  );
}

export default VendaCadastroPage;
