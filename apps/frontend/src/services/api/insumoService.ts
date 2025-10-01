import { apiClient } from "./client";
import type {
  Insumo,
  CreateInsumoDto,
  UpdateInsumoDto,
} from "../../types/insumo.js";

// Defina a interface para o tipo de resposta da API de paginação
interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

class InsumoService {
  // Remova o método getAll, que não é mais eficiente para grandes volumes de dados
  // async getAll(): Promise<Insumo[]> {
  //   return await apiClient.get<Insumo[]>("/insumos");
  // }

  // Adicione o novo método de paginação que implementa a tática de desempenho
  async findAllPaginated(page: number, limit: number): Promise<PaginatedResponse<Insumo>> {
    // A tática de Aumentar a Eficiência do Uso de Recursos é aplicada aqui,
    // enviando os parâmetros de query para o backend
    return await apiClient.get<PaginatedResponse<Insumo>>(`/insumos?page=${page}&limit=${limit}`);
  }

  async getById(id: string): Promise<Insumo> {
    return await apiClient.get<Insumo>(`/insumos/${id}`);
  }

  async create(data: CreateInsumoDto): Promise<Insumo> {
    return await apiClient.post<Insumo>("/insumos", data);
  }

  async update(id: string, data: UpdateInsumoDto): Promise<Insumo> {
    return await apiClient.put<Insumo>(`/insumos/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/insumos/${id}`);
  }
}

export const insumoService = new InsumoService();


// import { apiClient } from "./client";
// import type {
//   Insumo,
//   CreateInsumoDto,
//   UpdateInsumoDto,
// } from "../../types/insumo.js";

// class InsumoService {
//   async getAll(): Promise<Insumo[]> {
//     return await apiClient.get<Insumo[]>("/insumos");
//   }

//   async getById(id: string): Promise<Insumo> {
//     return await apiClient.get<Insumo>(`/insumos/${id}`);
//   }

//   async create(data: CreateInsumoDto): Promise<Insumo> {
//     return await apiClient.post<Insumo>("/insumos", data);
//   }

//   async update(id: string, data: UpdateInsumoDto): Promise<Insumo> {
//     return await apiClient.put<Insumo>(`/insumos/${id}`, data);
//   }

//   async delete(id: string): Promise<void> {
//     await apiClient.delete(`/insumos/${id}`);
//   }
// }

// export const insumoService = new InsumoService();
