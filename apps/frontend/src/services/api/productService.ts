import { apiClient } from "./client";
// Importa o tipo PaginatedResponse Padrão
import type { PaginatedResponse } from "./index"; 

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  status: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: string;
  category?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  status?: string;
  category?: string;
}

export interface ProductsFilters {
  name?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// NOVO TIPO: Define o tipo paginado para Produtos
export type PaginatedProducts = PaginatedResponse<Product>;

export class ProductService {
  
  // MODIFICADO: Substitui getAllProducts por uma versão paginada
  async getAllProducts(page: number, limit: number): Promise<PaginatedProducts> {
    return await apiClient.get<PaginatedProducts>(
      `/products?page=${page}&limit=${limit}`
    );
  }

  async getProductById(id: string): Promise<Product> {
    return await apiClient.get<Product>(`/products/${id}`);
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    return await apiClient.post<Product>("/products", productData);
  }

  async updateProduct(
    id: string,
    productData: UpdateProductRequest
  ): Promise<Product> {
    return await apiClient.put<Product>(`/products/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<void> {
    return await apiClient.delete<void>(`/products/${id}`);
  }

  // Os métodos de filtro abaixo devem ser adaptados para paginação em uma melhoria futura, 
  // mas mantemos o retorno não paginado por enquanto para cumprir a B3.
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await apiClient.get<Product[]>(
      `/products/filter/category?category=${category}`
    );
  }

  async getProductsByName(name: string): Promise<Product[]> {
    return await apiClient.get<Product[]>(`/products/filter/name?name=${name}`);
  }

  async getProductsByStatus(status: string): Promise<Product[]> {
    return await apiClient.get<Product[]>(
      `/products/filter/status?status=${status}`
    );
  }

  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<Product[]> {
    return await apiClient.get<Product[]>(
      `/products/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await apiClient.get<Product[]>(`/products/search?q=${query}`);
  }

  async getAvailableProducts(): Promise<Product[]> {
    return await this.getProductsByStatus("DISPONIVEL");
  }

  async getLowStockProducts(threshold = 10): Promise<Product[]> {
    return await apiClient.get<Product[]>(
      `/products/low-stock?threshold=${threshold}`
    );
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return await this.updateProduct(id, { quantity });
  }

  async increaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);
    return await this.updateProduct(id, {
      quantity: product.quantity + quantity,
    });
  }

  async decreaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);
    const newQuantity = Math.max(0, product.quantity - quantity);
    return await this.updateProduct(id, { quantity: newQuantity });
  }
}

export const productService = new ProductService();
