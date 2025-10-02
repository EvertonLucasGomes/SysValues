// apps/frontend/src/hooks/useInsumos.ts

import { useCallback } from "react";
import { insumoService } from "../services/api/insumoService"; 

import type { 
    Insumo, 
    CreateInsumoDto, 
    UpdateInsumoDto,
    PaginatedInsumos,
} from "../services/api"; 

import { usePaginatedFetch, type PaginatedFetchResult } from "./usePaginatedFetch";

export interface UseInsumosResult extends Omit<PaginatedFetchResult<Insumo>, 'data' | 'refresh'> {
    insumos: Insumo[];
    refreshInsumos: () => void;
    createInsumo: (data: CreateInsumoDto) => Promise<void>;
    updateInsumo: (id: string, data: UpdateInsumoDto) => Promise<void>;
    deleteInsumo: (id: string) => Promise<void>;
}

// REMOVIDO: 'export' da linha de função
function useInsumos(): UseInsumosResult {
    
    const fetchInsumosPaginated = useCallback(
        (page: number, limit: number): Promise<PaginatedInsumos> => {
            return insumoService.findAllPaginated(page, limit);
        },
        []
    );

    const {
        data,
        loading,
        error,
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        setPage,
        refresh
    } = usePaginatedFetch<Insumo>({
        fetchFn: fetchInsumosPaginated,
        initialLimit: 10,
    });

    const refreshInsumos = refresh;

    const createInsumo = useCallback(async (data: CreateInsumoDto) => {
        try {
            await insumoService.create(data);
            refreshInsumos();
        } catch (err) {
            throw err;
        }
    }, [refreshInsumos]);

    const updateInsumo = useCallback(async (id: string, data: UpdateInsumoDto) => {
        try {
            await insumoService.update(id, data);
            refreshInsumos();
        } catch (err) {
            throw err;
        }
    }, [refreshInsumos]);

    const deleteInsumo = useCallback(async (id: string) => {
        try {
            await insumoService.delete(id);
            refreshInsumos();
        } catch (err) {
            throw err;
        }
    }, [refreshInsumos]);

    return {
        insumos: data,
        loading,
        error,
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        setPage,
        
        refreshInsumos,
        createInsumo,
        updateInsumo,
        deleteInsumo,
    };
}

// ADICIONADO: Exportação Padrão (RESOLVE O SYNTAXERROR)
export default useInsumos;

