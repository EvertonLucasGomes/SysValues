// src/pages/vendas/VendaCadastroPage.tsx
import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { useSaleForm } from "@/hooks/useSaleForm";
import { VendaFormInputs } from "@/components/vendas/VendaFormInputs";
import { VendaPaymentDelivery } from "@/components/vendas/VendaPaymentDelivery";
import { VendaTotals } from "@/components/vendas/VendaTotals";
import { VendaFormActions } from "@/components/vendas/VendaFormActions";

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <VendaFormInputs
            formData={formData}
            setField={setField}
            uaps={uaps}
            products={products}
          />
          <VendaPaymentDelivery formData={formData} setField={setField} />
          <VendaTotals formData={formData} setField={setField} />
          <VendaFormActions loading={loading} error={error} />
        </form>
      </div>
    </SideMenu>
  );
}
