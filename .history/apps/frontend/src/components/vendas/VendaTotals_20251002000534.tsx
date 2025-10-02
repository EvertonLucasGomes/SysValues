// src/components/vendas/VendaTotals.tsx
import { FormField } from "@/components/ui/FormField";

interface Props {
  formData: any;
  setField: (field: string, value: any) => void;
}

export const VendaTotals = ({ formData, setField }: Props) => (
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
);
