import { CreateProductDto } from "@shared/dto/product/create-product.dto";
import { UpdateProductDto } from "@shared/dto/product/update-product.dto";
import { Product } from "@shared/types/product";
import { EProductStatus } from "@shared/enums/product.enum";

// NOVO TIPO: Define os parâmetros de paginação (reutilizando o padrão)
export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  findByStatus(status: EProductStatus): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  
  // NOVO MÉTODO PARA PAGINAÇÃO (B3)
  findAndCount(params: PaginationParams): Promise<[Product[], number]>;
  
  create(data: CreateProductDto): Promise<Product>;
  update(id: string, data: UpdateProductDto): Promise<Product | null>;
  delete(id: string): Promise<void>;
}

