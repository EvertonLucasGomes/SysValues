import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";

interface Props {
  loading: boolean;
  error: string | null;
}

export const VendaFormActions = ({ loading, error }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <div className="flex gap-4">
        <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
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

      {error && <div className="text-red-600 text-center mt-4">Erro: {error}</div>}
    </div>
  );