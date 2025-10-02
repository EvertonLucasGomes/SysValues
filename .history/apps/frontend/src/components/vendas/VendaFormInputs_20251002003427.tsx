import { FormField } from "@/components/ui/FormField";
import { UapSelect } from "@/components/ui/inputs/UapSelect";
import { ProductSelect } from "@/components/ui/inputs/ProductSelect";

interface Props {
  formData: any;
  setField: (field: string, value: any) => void;
  uaps: any[];
  products: any[];
}

export const VendaFormInputs = ({
  formData,
  setField,
  uaps,
  products,
}: Props) => {
  // Data de hoje no formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  return (
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
          className="input-field pl-10"
          type="date"
          value={formData.saleDate}
          max={today} // Limite para hoje
          onChange={(e) => setField("saleDate", e.target.value)}
        />
      </FormField>
    </div>
  );
};
