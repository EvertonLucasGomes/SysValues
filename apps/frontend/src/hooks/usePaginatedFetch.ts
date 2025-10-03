// usePaginatedFetch.ts

import { useState, useEffect, useCallback } from "react";

// Tipos genéricos de retorno de paginação 
import type { PaginatedResponse, Meta } from "../services/api"; 

// 1. Interface de Propriedades Genéricas
interface PaginatedFetchProps<T> {
  // A função de serviço que busca os dados paginados. 
  // Ela deve aceitar (page, limit) e retornar uma Promise do tipo paginado.
  fetchFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>;
  initialLimit?: number;
}

// 2. Interface do Resultado Genérico
export interface PaginatedFetchResult<T> {
  data: T[];
  loading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setPage: (page: number) => void;
  refresh: () => void;
}

export function usePaginatedFetch<T>({
  fetchFn,
  initialLimit = 10,
}: PaginatedFetchProps<T>): PaginatedFetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(initialLimit); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Função para mudar a página
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Função de busca principal
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchFn(currentPage, itemsPerPage); // Chamada genérica

      setData(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalItems(result.meta.total);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar dados paginados";
      setError(errorMessage);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, currentPage, itemsPerPage]);

  // Função de refresh
  const refresh = useCallback(() => {
    // Se não estiver na pág 1, volta para 1 para recarregar.
    if (currentPage !== 1) {
        setCurrentPage(1);
    } else {
        fetchData(); // Se já estiver na 1, apenas recarrega
    }
  }, [currentPage, fetchData]);

  // Efeito que dispara a busca quando a página muda
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
    refresh,
  };
}