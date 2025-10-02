import { FaBox } from "react-icons/fa";
import { FormField } from "@/components/ui/FormField";

export function ProductSelect({ value, onChange, products }: any) {
  return (
    <FormField label="Produto" required>
      <div className="relative">
        <FaBox
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agro-500"
          size={14}
        />
        <select
          className="input-field pl-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Selecionar produto...</option>
          {products.map((product: any) => (
            <option key={product.id} value={product.id}>
              {product.name} - R$ {product.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  );
}
