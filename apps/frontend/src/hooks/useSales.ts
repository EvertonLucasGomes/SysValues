import { useState, useEffect, useCallback } from "react";
import { salesService } from "../services/api/salesService";
import type {
  CreateSaleRequest,
  UpdateSaleRequest,
  SaleWithItems,
  SaleFilters,
  PaginatedSales, // <--- ADICIONADO: Novo tipo paginado
} from "../services/api/salesService";

export interface UseSalesResult {
  sales: SaleWithItems[];
  loading: boolean;
  error: string;
  fetchSales: (filter?: string) => Promise<void>;
  refreshSales: () => Promise<void>;
  createSale: (saleData: CreateSaleRequest) => Promise<void>;
  updateSale: (id: string, saleData: UpdateSaleRequest) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  completeSale: (id: string) => Promise<void>;
  getSalesByStatus: (status: string) => Promise<void>;
  getSalesByUserId: (userId: string) => Promise<void>;
  searchSales: (filters: SaleFilters) => Promise<void>;
  
  // PROPRIEDADES DE PAGINAÇÃO ADICIONADAS:
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setPage: (page: number) => void;
}

export function useSales(initialFilter?: string): UseSalesResult {
  const [sales, setSales] = useState<SaleWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // ESTADOS DE PAGINAÇÃO ADICIONADOS
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // FUNÇÃO setPage ADICIONADA
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const fetchSales = useCallback(async (filter?: string) => {
    try {
      setLoading(true);
      setError("");

      let result: PaginatedSales; // O retorno agora é PaginatedSales

      // Se houver filtro, mantemos a lógica original (que não é paginada)
      if (filter) {
        // Para simplificar e manter o foco no getAllSales, chamamos a versão paginada
        // Se a busca real for por 'filter', você precisará paginar o searchSales também.
        result = await salesService.getAllSales(currentPage, itemsPerPage);
      } else {
        // MODIFICADO: Usando a função paginada do service
        result = await salesService.getAllSales(currentPage, itemsPerPage);
      }

      // MODIFICADO: Setar os dados da página e os metadados
      setSales(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalItems(result.meta.total);

    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        setSales([]);
        setError("");
        setTotalPages(1); 
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar vendas";
        setError(errorMessage);
        setTotalPages(1); 
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]); // DEPENDÊNCIA: currentPage para refetch

  const refreshSales = useCallback(async () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      await fetchSales(initialFilter);
    }
  }, [fetchSales, initialFilter, currentPage]);

  const createSale = useCallback(async (saleData: CreateSaleRequest) => {
    setLoading(true);
    setError("");
    try {
      await salesService.createSale(saleData);
      // Após a criação, forçamos um refresh
      await refreshSales(); 
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar venda";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshSales]);

  const updateSale = useCallback(
    async (id: string, saleData: UpdateSaleRequest) => {
      setLoading(true);
      setError("");

      try {
        await salesService.updateSale(id, saleData);
        // Forçamos um refresh da página atual para obter dados atualizados
        await fetchSales(initialFilter);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar venda";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSales, initialFilter]
  );

  const deleteSale = useCallback(async (id: string) => {
    setLoading(true);
    setError("");

    try {
      await salesService.deleteSale(id);
      // Após a exclusão, recarregamos a página para garantir que a lista esteja correta
      await fetchSales(initialFilter);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir venda";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSales, initialFilter]);

  const completeSale = useCallback(async (id: string) => {
    setLoading(true);
    setError("");

    try {
      await salesService.completeSale(id);
      // Após completar, atualizamos a página atual.
      await fetchSales(initialFilter);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao completar venda";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSales, initialFilter]);
  
  // Funções de filtro (mantidas sem paginação por enquanto)
  const getSalesByStatus = useCallback(async (status: string) => {
    try {
      setLoading(true);
      setError("");
      const result = await salesService.getSalesByStatus(status);
      setSales(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar vendas por status";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSalesByUserId = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError("");
      const result = await salesService.getSalesByUapId(userId);
      setSales(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao buscar vendas por usuário";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSales = useCallback(async (filters: SaleFilters) => {
    try {
      setLoading(true);
      setError("");
      // OBS: searchSales também deveria ser paginado. Mantido sem por enquanto.
      const result = await salesService.searchSales(filters);
      setSales(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar vendas";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // MODIFICADO: O useEffect agora observa o currentPage
  useEffect(() => {
    fetchSales(initialFilter);
  }, [fetchSales, initialFilter, currentPage]); // <-- ADICIONADO currentPage

  return {
    sales,
    loading,
    error,
    fetchSales,
    refreshSales,
    createSale,
    updateSale,
    deleteSale,
    completeSale,
    getSalesByStatus,
    getSalesByUserId,
    searchSales,
    
    // NOVOS RETORNOS DE PAGINAÇÃO:
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
  };
}


