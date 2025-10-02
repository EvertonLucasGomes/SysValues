import { useState, useEffect } from "react";
import { useSales } from "@/hooks/useSales";
import { useProduct } from "@/hooks/useProduct";
import { useUap } from "@/hooks/useUap";

export function useSaleForm(initialData = {}) {
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
    ...initialData,
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
      if (!isNaN(desconto) && desconto > 0) total *= 1 - desconto / 100;
      setFormData((prev) => ({ ...prev, valorTotal: total.toFixed(2) }));
    }
  }, [formData.quantidade, formData.precoUnitario, formData.desconto]);

  const setField = (field: string, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      // Atualizar precoUnitario ao selecionar produto
      if (field === "produto") {
        const product = products.find((p) => p.id === value);
        if (product) next.precoUnitario = product.price.toString();
      }

      return next;
    });
  };

  const submit = async () => {
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

    return createSale(saleData);
  };

  return { formData, setField, products, uaps, submit, loading, error };
}
