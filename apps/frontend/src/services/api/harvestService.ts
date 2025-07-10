import { apiClient } from "./client";

export interface Harvest {
  id: string;
  harvestDate: string;
  product: string;
  quantity: number;
  unit: string;
  uap: string;
  responsible: string;
  cycle: string;
  status: string;
  equipment?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHarvestRequest {
  harvestDate: string;
  product: string;
  quantity: number;
  unit: string;
  uap: string;
  responsible: string;
  cycle: string;
  status: string;
  equipment?: string;
  observations?: string;
}

export interface UpdateHarvestRequest {
  harvestDate?: string;
  product?: string;
  quantity?: number;
  unit?: string;
  uap?: string;
  responsible?: string;
  cycle?: string;
  status?: string;
  equipment?: string;
  observations?: string;
}

export class HarvestService {
  async getAllHarvests(): Promise<Harvest[]> {
    return await apiClient.get<Harvest[]>("/harvests");
  }

  async getHarvestById(id: string): Promise<Harvest> {
    return await apiClient.get<Harvest>(`/harvests/${id}`);
  }

  async createHarvest(harvestData: CreateHarvestRequest): Promise<Harvest> {
    return await apiClient.post<Harvest>("/harvests", harvestData);
  }

  async updateHarvest(
    id: string,
    harvestData: UpdateHarvestRequest
  ): Promise<Harvest> {
    return await apiClient.patch<Harvest>(`/harvests/${id}`, harvestData);
  }

  async deleteHarvest(id: string): Promise<void> {
    return await apiClient.delete<void>(`/harvests/${id}`);
  }

  async getHarvestsByStatus(status: string): Promise<Harvest[]> {
    return await apiClient.get<Harvest[]>(
      `/harvests/filter/status?status=${status}`
    );
  }

  async getHarvestsByProduct(product: string): Promise<Harvest[]> {
    return await apiClient.get<Harvest[]>(
      `/harvests/filter/product?product=${product}`
    );
  }

  async getHarvestsByCycle(cycle: string): Promise<Harvest[]> {
    return await apiClient.get<Harvest[]>(
      `/harvests/filter/cycle?cycle=${cycle}`
    );
  }
}

export const harvestService = new HarvestService();
