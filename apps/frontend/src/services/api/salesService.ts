import { apiClient } from "./client";

//adicionando iportação dos tipos
import type { Meta, PaginatedResponse} from "./index.ts";

export type PaginatedSales = PaginatedResponse<SaleWithItems>

export interface SaleWithItems {
  id: string;
  uapId: string;
  totalAmount: number;
  status: string;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
  saleItems: {
    id: string;
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    product: {
      id: string;
      name: string;
      price: number;
    };
  }[];
  uap?: {
    id: string;
    name: string;
    location: string;
    responsible: string;
  };
}

export interface CreateSaleRequest {
  uapId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  status?: string;
  saleDate?: string;
}

export interface UpdateSaleRequest {
  status?: string;
  saleDate?: string;
}

export interface SaleFilters {
  status?: string;
  uapId?: string;
}

export class SalesService {
//getallsales adicionado
  async getAllSales(page: number, limit: number): Promise<PaginatedSales> {
    return await apiClient.get<PaginatedSales>(
      `/sales?page=${page}&limit=${limit}`
    );
  }

  async getSaleById(id: string): Promise<SaleWithItems> {
    return await apiClient.get<SaleWithItems>(`/sales/${id}`);
  }

  async createSale(saleData: CreateSaleRequest): Promise<SaleWithItems> {
    return await apiClient.post<SaleWithItems>("/sales", saleData);
  }

  async updateSale(
    id: string,
    saleData: UpdateSaleRequest
  ): Promise<SaleWithItems> {
    return await apiClient.patch<SaleWithItems>(`/sales/${id}`, saleData);
  }

  async deleteSale(id: string): Promise<void> {
    return await apiClient.delete<void>(`/sales/${id}`);
  }

  async getSalesByStatus(status: string): Promise<SaleWithItems[]> {
    return await apiClient.get<SaleWithItems[]>(
      `/sales/filter/status?status=${status}`
    );
  }

  async getSalesByUapId(uapId: string): Promise<SaleWithItems[]> {
    return await apiClient.get<SaleWithItems[]>(`/sales/uap/${uapId}`);
  }

  async completeSale(id: string): Promise<SaleWithItems> {
    return await apiClient.patch<SaleWithItems>(`/sales/${id}/complete`);
  }

  async searchSales(filters: SaleFilters): Promise<SaleWithItems[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.append("status", filters.status);
    }

    if (filters.uapId) {
      params.append("uapId", filters.uapId);
    }

    return await apiClient.get<SaleWithItems[]>(`/sales?${params.toString()}`);
  }
}

export const salesService = new SalesService();
