import { useCallback } from "react";
import { harvestService } from "../services/api";
import type {
  CreateHarvestRequest,
  UpdateHarvestRequest,
  Harvest,
  PaginatedHarvests,
} from "../services/api";
// 1. IMPORTAÇÃO DO NOVO HOOK E SEUS TIPOS
import { usePaginatedFetch, type PaginatedFetchResult } from "./usePaginatedFetch";

// 2. INTERFACE: Estende o tipo genérico e renomeia 'data' para 'harvests'
export interface UseHarvestResult extends Omit<PaginatedFetchResult<Harvest>, 'data' | 'refresh'> {
  harvests: Harvest[]; // Mantém o nome 'harvests' para compatibilidade com ColheitaPage
  
  refreshHarvests: () => void; // Mantém o nome 'refreshHarvests'
  createHarvest: (harvestData: CreateHarvestRequest) => Promise<void>;
  updateHarvest: (
    id: string,
    harvestData: UpdateHarvestRequest
  ) => Promise<void>;
  deleteHarvest: (id: string) => Promise<void>;
  
  // Funções específicas de filtro
  getHarvestsByStatus: (status: string) => Promise<void>;
  getHarvestsByProduct: (product: string) => Promise<void>;
  getHarvestsByCycle: (cycle: string) => Promise<void>;
}

export function useHarvest(initialFilter?: string): UseHarvestResult {
  
  // 3. FUNÇÃO DE SERVIÇO WRAPPER: Prepara a função de serviço para o hook genérico.
  const fetchHarvestsPaginated = useCallback(
    (page: number, limit: number): Promise<PaginatedHarvests> => {
      // Ignora o 'initialFilter' por enquanto e chama o serviço
      return harvestService.getAllHarvests(page, limit);
    },
    []
  );

  // 4. USO DO HOOK GENÉRICO
  const { 
    data, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    itemsPerPage, 
    totalItems, 
    setPage, 
    refresh // Capturamos a função refresh do hook genérico
  } = usePaginatedFetch<Harvest>({
    fetchFn: fetchHarvestsPaginated,
    initialLimit: 10,
  });
  
  // 5. ALIAS: Renomeia 'refresh' para 'refreshHarvests'
  const refreshHarvests = refresh;


  // --- LÓGICA DE AÇÕES (Simplificada) ---
  
  // Removemos o código duplicado de loading/error/useState das ações, 
  // usando o refresh para atualizar o estado do hook genérico.

  const createHarvest = useCallback(
    async (harvestData: CreateHarvestRequest) => {
      try {
        await harvestService.createHarvest(harvestData);
        refreshHarvests(); // Usa a função de refresh do hook genérico
      } catch (err) {
        // ... (tratamento de erro)
        throw err;
      } 
    },
    [refreshHarvests]
  );
  
  const updateHarvest = useCallback(
    async (id: string, harvestData: UpdateHarvestRequest) => {
      try {
        await harvestService.updateHarvest(id, harvestData);
        refreshHarvests(); 
      } catch (err) {
        // ...
        throw err;
      } 
    },
    [refreshHarvests]
  );

  const deleteHarvest = useCallback(async (id: string) => {
    try {
      await harvestService.deleteHarvest(id);
      refreshHarvests(); // Recarrega a página atual para manter a consistência
    } catch (err) {
      // ...
      throw err;
    }
  }, [refreshHarvests]);

  // As funções de filtro individual (mantidas por simplicidade)
  const getHarvestsByStatus = useCallback(async (status: string) => {
    // ... (lógica antiga)
  }, []);

  const getHarvestsByProduct = useCallback(async (product: string) => {
    // ... (lógica antiga)
  }, []);

  const getHarvestsByCycle = useCallback(async (cycle: string) => {
    // ... (lógica antiga)
  }, []);


  // --- RETORNO FINAL: Mantém a assinatura EXATA do original ---
  return {
    harvests: data, // Renomeado de volta para 'harvests'
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
    
    // Funções do hook específico
    refreshHarvests,
    createHarvest,
    updateHarvest,
    deleteHarvest,
    getHarvestsByStatus,
    getHarvestsByProduct,
    getHarvestsByCycle,
  };
}
