import { FaMapMarkerAlt } from "react-icons/fa";
import { FormField } from "@/components/ui/FormField";

export function UapSelect({ value, onChange, uaps }: any) {
  return (
    <FormField label="UAP" required>
      <div className="relative">
        <FaMapMarkerAlt
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agro-500"
          size={14}
        />
        <select
          className="input-field pl-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Selecionar UAP...</option>
          {uaps.map((uap: any) => (
            <option key={uap.id} value={uap.id}>
              {uap.name} - {uap.location}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  );
}
