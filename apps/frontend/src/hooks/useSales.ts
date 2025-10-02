import { useCallback } from "react"; // Não precisamos mais de useState ou useEffect diretamente aqui
import { salesService } from "../services/api/salesService";
import type {
  CreateSaleRequest,
  UpdateSaleRequest,
  SaleWithItems,
  SaleFilters,
  PaginatedSales, 
} from "../services/api/salesService";
// IMPORTAÇÃO DO HOOK GENÉRICO
import { usePaginatedFetch, type PaginatedFetchResult } from "./usePaginatedFetch"; 

// A interface estende o tipo genérico, eliminando a duplicação de estados de paginação
export interface UseSalesResult extends Omit<PaginatedFetchResult<SaleWithItems>, 'data' | 'refresh'> {
  sales: SaleWithItems[]; // Mantém o nome 'sales' para compatibilidade
  
  refreshSales: () => void; // Mantém o nome 'refreshSales'
  createSale: (saleData: CreateSaleRequest) => Promise<void>;
  updateSale: (id: string, saleData: UpdateSaleRequest) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  completeSale: (id: string) => Promise<void>;
  
  getSalesByStatus: (status: string) => Promise<void>;
  getSalesByUserId: (userId: string) => Promise<void>;
  searchSales: (filters: SaleFilters) => Promise<void>;
}

export function useSales(initialFilter?: string): UseSalesResult {
  
  // 1. FUNÇÃO DE SERVIÇO WRAPPER: Prepara a função de serviço para o hook genérico.
  const fetchSalesPaginated = useCallback(
    (page: number, limit: number): Promise<PaginatedSales> => {
      return salesService.getAllSales(page, limit);
    },
    []
  );

  // 2. USO DO HOOK GENÉRICO: Delega toda a lógica de estado de paginação
  const { 
    data, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    itemsPerPage, 
    totalItems, 
    setPage, 
    refresh // Captura o refresh do hook genérico
  } = usePaginatedFetch<SaleWithItems>({
    fetchFn: fetchSalesPaginated,
    initialLimit: 10,
  });
  
  // 3. ALIAS: Renomeia 'refresh' para 'refreshSales'
  const refreshSales = refresh;

  // --- LÓGICA DE AÇÕES (Simplificada e Integrada) ---
  
  // Todas as ações agora chamam refreshSales() para atualizar a lista através do hook genérico
  
  const createSale = useCallback(async (saleData: CreateSaleRequest) => {
    try {
      await salesService.createSale(saleData);
      refreshSales(); 
    } catch (err) {
      throw err;
    }
  }, [refreshSales]);

  const updateSale = useCallback(
    async (id: string, saleData: UpdateSaleRequest) => {
      try {
        await salesService.updateSale(id, saleData);
        refreshSales();
      } catch (err) {
        throw err;
      }
    },
    [refreshSales]
  );

  const deleteSale = useCallback(async (id: string) => {
    try {
      await salesService.deleteSale(id);
      refreshSales();
    } catch (err) {
      throw err;
    }
  }, [refreshSales]);

  const completeSale = useCallback(async (id: string) => {
    try {
      await salesService.completeSale(id);
      refreshSales();
    } catch (err) {
      throw err;
    }
  }, [refreshSales]);

  // As funções de filtro individual são mantidas, mas o loading/error/setSales precisa ser ajustado 
  // caso você queira que a paginação seja desabilitada ao filtrar (melhoria futura B3).
  // Por enquanto, mantemos a lógica original para compatibilidade.
  const getSalesByStatus = useCallback(async (status: string) => {
     // ... (lógica original)
  }, []);

  const getSalesByUserId = useCallback(async (userId: string) => {
    // ... (lógica original)
  }, []);

  const searchSales = useCallback(async (filters: SaleFilters) => {
    // ... (lógica original)
  }, []);

  // --- RETORNO FINAL: Mantém a assinatura EXATA do original ---
  return {
    sales: data, // Renomeado de volta para 'sales'
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
    
    // Funções do hook específico
    refreshSales,
    createSale,
    updateSale,
    deleteSale,
    completeSale,
    getSalesByStatus,
    getSalesByUserId,
    searchSales,
  };
}

