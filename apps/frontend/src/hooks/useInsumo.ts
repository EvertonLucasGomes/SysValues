import { useState, useCallback } from "react";
import { insumoService } from "@/services/api/insumoService";
import type { Insumo, CreateInsumoDto, UpdateInsumoDto } from "@/types/insumo";

export function useInsumo() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modifying the fetchInsumos function to accept pagination arguments
  const fetchInsumos = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      // Assuming a new method findAllPaginated is available in insumoService
      const response = await insumoService.findAllPaginated(page, limit);
      // The response from the backend is now an object with data and total,
      // so you set the insumos with response.data
      setInsumos(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar insumos");
    } finally {
      setLoading(false);
    }
  }, []);

  const createInsumo = useCallback(async (data: CreateInsumoDto) => {
    setLoading(true);
    setError(null);
    try {
      const newInsumo = await insumoService.create(data);
      setInsumos((prev) => [newInsumo, ...prev]);
      return newInsumo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar insumo");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInsumo = useCallback(
    async (id: string, data: UpdateInsumoDto) => {
      setLoading(true);
      setError(null);
      try {
        const updatedInsumo = await insumoService.update(id, data);
        setInsumos((prev) =>
          prev.map((insumo) => (insumo.id === id ? updatedInsumo : insumo))
        );
        return updatedInsumo;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao atualizar insumo"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteInsumo = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await insumoService.delete(id);
      setInsumos((prev) => prev.filter((insumo) => insumo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar insumo");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    insumos,
    loading,
    error,
    fetchInsumos,
    createInsumo,
    updateInsumo,
    deleteInsumo,
  };
}


// import { useState, useCallback } from "react";
// import { insumoService } from "@/services/api/insumoService";
// import type { Insumo, CreateInsumoDto, UpdateInsumoDto } from "@/types/insumo";

// export function useInsumo() {
//   const [insumos, setInsumos] = useState<Insumo[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchInsumos = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await insumoService.getAll();
//       setInsumos(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erro ao carregar insumos");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const createInsumo = useCallback(async (data: CreateInsumoDto) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const newInsumo = await insumoService.create(data);
//       setInsumos((prev) => [newInsumo, ...prev]);
//       return newInsumo;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erro ao criar insumo");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const updateInsumo = useCallback(
//     async (id: string, data: UpdateInsumoDto) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const updatedInsumo = await insumoService.update(id, data);
//         setInsumos((prev) =>
//           prev.map((insumo) => (insumo.id === id ? updatedInsumo : insumo))
//         );
//         return updatedInsumo;
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Erro ao atualizar insumo"
//         );
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const deleteInsumo = useCallback(async (id: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await insumoService.delete(id);
//       setInsumos((prev) => prev.filter((insumo) => insumo.id !== id));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erro ao deletar insumo");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return {
//     insumos,
//     loading,
//     error,
//     fetchInsumos,
//     createInsumo,
//     updateInsumo,
//     deleteInsumo,
//   };
// }
