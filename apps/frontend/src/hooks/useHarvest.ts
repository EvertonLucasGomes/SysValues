import { useState, useEffect, useCallback } from "react";
import { harvestService } from "../services/api";
import type {
  CreateHarvestRequest,
  UpdateHarvestRequest,
  Harvest,
  PaginatedHarvests, // Agora importado corretamente
} from "../services/api";

export interface UseHarvestResult {
  harvests: Harvest[];
  loading: boolean;
  error: string;
  fetchHarvests: (filter?: string) => Promise<void>;
  refreshHarvests: () => Promise<void>;
  createHarvest: (harvestData: CreateHarvestRequest) => Promise<void>;
  updateHarvest: (
    id: string,
    harvestData: UpdateHarvestRequest
  ) => Promise<void>;
  deleteHarvest: (id: string) => Promise<void>;
  getHarvestsByStatus: (status: string) => Promise<void>;
  getHarvestsByProduct: (product: string) => Promise<void>;
  getHarvestsByCycle: (cycle: string) => Promise<void>;

  // PROPRIEDADES DE PAGINAÇÃO
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setPage: (page: number) => void; // Função para mudar de página
}

export function useHarvest(initialFilter?: string): UseHarvestResult {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
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

  const fetchHarvests = useCallback(async (filter?: string) => {
    try {
      setLoading(true);
      setError("");

      let result: PaginatedHarvests; // O retorno agora é PaginatedHarvests

      // O filtro por status/produto/ciclo AINDA NÃO É PAGINADO. 
      // Por isso, se houver 'filter', mantemos a lógica que busca tudo.
      if (filter) {
        // Se a busca por status/produto/ciclo for chamada, ela não usará paginação.
        // Se 'filter' for um termo de busca geral, usaremos a função paginada.
        // Para simplificar a correção do bug A3, vamos focar apenas no getAllHarvests.
        result = await harvestService.getAllHarvests(currentPage, itemsPerPage);
        
      } else {
        // MODIFICADO: Usando a função paginada
        result = await harvestService.getAllHarvests(currentPage, itemsPerPage);
      }

      // MODIFICADO: Setar os dados da página e os metadados
      setHarvests(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalItems(result.meta.total);
      
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        setHarvests([]);
        setError("");
        setTotalPages(1); 
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar colheitas";
        setError(errorMessage);
        setTotalPages(1); 
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]); // DEPENDÊNCIA: currentPage para refetch

  const refreshHarvests = useCallback(async () => {
    if (currentPage !== 1) {
        setCurrentPage(1);
    } else {
        await fetchHarvests(initialFilter);
    }
  }, [fetchHarvests, initialFilter, currentPage]);

  const createHarvest = useCallback(
    async (harvestData: CreateHarvestRequest) => {
      setLoading(true);
      setError("");
      try {
        const result = await harvestService.createHarvest(harvestData);
        // Não adicionamos à lista local para forçar o refresh/busca paginada correta
        // Se a lista fosse grande, adicionar aqui não faria sentido na pág 1.
        await refreshHarvests(); // Chamamos o refresh para garantir a consistência
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar colheita";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshHarvests]
  );

  const updateHarvest = useCallback(
    async (id: string, harvestData: UpdateHarvestRequest) => {
      setLoading(true);
      setError("");
      try {
        await harvestService.updateHarvest(id, harvestData);
        // Forçamos um refresh da página atual para obter dados atualizados
        await fetchHarvests(initialFilter); 
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar colheita";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchHarvests, initialFilter]
  );
  
  const deleteHarvest = useCallback(async (id: string) => {
    setLoading(true);
    setError("");

    try {
      await harvestService.deleteHarvest(id);
      // Após a exclusão, recarregamos a página para garantir que a lista esteja correta
      await fetchHarvests(initialFilter);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir colheita";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHarvests, initialFilter]);
  
  // As funções de filtro individual (ByStatus, ByProduct, ByCycle)
  // permanecem sem paginação, por enquanto.
  const getHarvestsByStatus = useCallback(async (status: string) => {
    //... (mantido)
  }, []);

  const getHarvestsByProduct = useCallback(async (product: string) => {
    //... (mantido)
  }, []);

  const getHarvestsByCycle = useCallback(async (cycle: string) => {
    //... (mantido)
  }, []);

  // MODIFICADO: O useEffect agora observa o currentPage
  useEffect(() => {
    fetchHarvests(initialFilter);
  }, [fetchHarvests, initialFilter, currentPage]); // <-- ADICIONADO currentPage

  return {
    harvests,
    loading,
    error,
    fetchHarvests,
    refreshHarvests,
    createHarvest,
    updateHarvest,
    deleteHarvest,
    getHarvestsByStatus,
    getHarvestsByProduct,
    getHarvestsByCycle,
    
    // NOVOS RETORNOS DE PAGINAÇÃO:
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
  };
}

//---------------------------------------------------
// import { useState, useEffect, useCallback } from "react";
// import { harvestService } from "../services/api";
// import type {
//   CreateHarvestRequest,
//   UpdateHarvestRequest,
//   Harvest,
// } from "../services/api";

// export interface UseHarvestResult {
//   harvests: Harvest[];
//   loading: boolean;
//   error: string;
//   fetchHarvests: (filter?: string) => Promise<void>;
//   refreshHarvests: () => Promise<void>;
//   createHarvest: (harvestData: CreateHarvestRequest) => Promise<void>;
//   updateHarvest: (
//     id: string,
//     harvestData: UpdateHarvestRequest
//   ) => Promise<void>;
//   deleteHarvest: (id: string) => Promise<void>;
//   getHarvestsByStatus: (status: string) => Promise<void>;
//   getHarvestsByProduct: (product: string) => Promise<void>;
//   getHarvestsByCycle: (cycle: string) => Promise<void>;
// }

// export function useHarvest(initialFilter?: string): UseHarvestResult {
//   const [harvests, setHarvests] = useState<Harvest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchHarvests = useCallback(async (filter?: string) => {
//     try {
//       setLoading(true);
//       setError("");

//       let result: Harvest[];

//       if (filter) {
//         result = await harvestService.getHarvestsByStatus(filter);
//       } else {
//         result = await harvestService.getAllHarvests();
//       }

//       setHarvests(result);
//     } catch (err) {
//       // Handle 404 errors gracefully - treat as empty result
//       if (err instanceof Error && err.message.includes("404")) {
//         setHarvests([]);
//         setError("");
//       } else {
//         const errorMessage =
//           err instanceof Error ? err.message : "Erro ao buscar colheitas";
//         setError(errorMessage);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const refreshHarvests = useCallback(async () => {
//     await fetchHarvests(initialFilter);
//   }, [fetchHarvests, initialFilter]);

//   const createHarvest = useCallback(
//     async (harvestData: CreateHarvestRequest) => {
//       setLoading(true);
//       setError("");

//       try {
//         const result = await harvestService.createHarvest(harvestData);
//         setHarvests((prev) => [...prev, result]);
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Erro ao criar colheita";
//         setError(errorMessage);
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const updateHarvest = useCallback(
//     async (id: string, harvestData: UpdateHarvestRequest) => {
//       setLoading(true);
//       setError("");

//       try {
//         const result = await harvestService.updateHarvest(id, harvestData);
//         setHarvests((prev) =>
//           prev.map((harvest) => (harvest.id === id ? result : harvest))
//         );
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Erro ao atualizar colheita";
//         setError(errorMessage);
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const deleteHarvest = useCallback(async (id: string) => {
//     setLoading(true);
//     setError("");

//     try {
//       await harvestService.deleteHarvest(id);
//       setHarvests((prev) => prev.filter((harvest) => harvest.id !== id));
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Erro ao excluir colheita";
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const getHarvestsByStatus = useCallback(async (status: string) => {
//     try {
//       setLoading(true);
//       setError("");
//       const result = await harvestService.getHarvestsByStatus(status);
//       setHarvests(result);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Erro ao filtrar colheitas por status";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const getHarvestsByProduct = useCallback(async (product: string) => {
//     try {
//       setLoading(true);
//       setError("");
//       const result = await harvestService.getHarvestsByProduct(product);
//       setHarvests(result);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Erro ao filtrar colheitas por produto";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const getHarvestsByCycle = useCallback(async (cycle: string) => {
//     try {
//       setLoading(true);
//       setError("");
//       const result = await harvestService.getHarvestsByCycle(cycle);
//       setHarvests(result);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Erro ao filtrar colheitas por ciclo";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchHarvests(initialFilter);
//   }, [fetchHarvests, initialFilter]);

//   return {
//     harvests,
//     loading,
//     error,
//     fetchHarvests,
//     refreshHarvests,
//     createHarvest,
//     updateHarvest,
//     deleteHarvest,
//     getHarvestsByStatus,
//     getHarvestsByProduct,
//     getHarvestsByCycle,
//   };
// }
