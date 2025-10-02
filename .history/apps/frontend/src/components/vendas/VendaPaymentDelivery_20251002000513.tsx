// src/components/vendas/VendaPaymentDelivery.tsx
import { FormField } from "@/components/ui/FormField";

interface Props {
  formData: any;
  setField: (field: string, value: any) => void;
}

const paymentMethods = [
  "dinheiro",
  "cheque",
  "cartao",
  "boleto",
  "pix",
  "transferencia",
];
const deliveryConditions = ["imediata", "agendada", "retirada", "transporte"];

export const VendaPaymentDelivery = ({ formData, setField }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField label="Forma de Pagamento" required>
      <select
        className="input-field"
        value={formData.formaPagamento}
        onChange={(e) => setField("formaPagamento", e.target.value)}
      >
        <option value="">Selecione a forma de pagamento</option>
        {paymentMethods.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </FormField>

    <FormField label="Condição de Entrega" required>
      <select
        className="input-field"
        value={formData.condicaoEntrega}
        onChange={(e) => setField("condicaoEntrega", e.target.value)}
      >
        <option value="">Selecione a condição</option>
        {deliveryConditions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </FormField>
  </div>
);
