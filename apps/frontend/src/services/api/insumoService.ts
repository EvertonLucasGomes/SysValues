// apps/frontend/src/services/api/insumoService.ts

import { apiClient } from "./client";
import type {
  Insumo,
  CreateInsumoDto,
  UpdateInsumoDto,
  // PaginatedResponse,
} from "../../../../../shared/types/insumo"; // <-- Mantenha seu caminho CORRETO aqui
import type {EUnit} from "../../../../../shared/enums/unit.enum";

import type { PaginatedResponse } from "./index";

export type { Insumo, CreateInsumoDto, UpdateInsumoDto, EUnit };

export type PaginatedInsumos = PaginatedResponse<Insumo>; 

class InsumoService {
  
  // 2. FUNÇÃO DE BUSCA PAGINADA: Usa o tipo padronizado PaginatedInsumos
  async findAllPaginated(page: number, limit: number): Promise<PaginatedInsumos> {
    // A chamada agora espera o formato { data: [...], meta: {...} } do backend
    return await apiClient.get<PaginatedInsumos>(`/insumos?page=${page}&limit=${limit}`);
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

