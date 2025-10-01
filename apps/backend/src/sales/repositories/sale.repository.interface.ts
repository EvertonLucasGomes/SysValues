import { CreateSaleDto } from "@shared/dto/sale/create-sale.dto";
import { UpdateSaleDto } from "@shared/dto/sale/update-sale.dto";
import { SaleWithItems } from "@shared/types/product";
import { ESaleStatus } from "@shared/enums/product.enum";

// NOVO TIPO: Define os parâmetros de paginação (reutilizando a lógica de Colheitas)
export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface ISaleRepository {
  findAll(): Promise<SaleWithItems[]>;
  findOne(id: string): Promise<SaleWithItems | null>;
  findById(id: string): Promise<SaleWithItems | null>;
  findByUapId(uapId: string): Promise<SaleWithItems[]>;
  findByStatus(status: ESaleStatus): Promise<SaleWithItems[]>;
  create(data: CreateSaleDto): Promise<SaleWithItems>;
  update(id: string, data: UpdateSaleDto): Promise<SaleWithItems | null>;
  delete(id: string): Promise<void>;

  // NOVO MÉTODO PARA PAGINAÇÃO
  findAndCount(params: PaginationParams): Promise<[SaleWithItems[], number]>;
}

