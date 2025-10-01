import { Harvest } from "@prisma/client";
import { CreateHarvestDto } from "@shared/dto/harvest/create-harvest.dto";
import { UpdateHarvestDto } from "@shared/dto/harvest/update-harvest.dto";

// NOVO TIPO: Define os parâmetros de paginação que o Service envia
export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface IHarvestRepository {
  create(data: CreateHarvestDto): Promise<Harvest>;
  
  // O MÉTODO findAll() ESTÁ OBSOLETO (não paginado), mas vamos mantê-lo
  // para não quebrar outras partes do sistema.
  findAll(): Promise<Harvest[]>;
  
  findOne(id: string): Promise<Harvest | null>;
  update(id: string, data: UpdateHarvestDto): Promise<Harvest | null>;
  delete(id: string): Promise<void>;
  findByStatus(status: string): Promise<Harvest[]>;
  findByProduct(product: string): Promise<Harvest[]>;
  findByCycle(cycle: string): Promise<Harvest[]>;
  
  // NOVO MÉTODO PARA PAGINAÇÃO
  findAndCount(params: PaginationParams): Promise<[Harvest[], number]>; 
}

// import { Harvest } from "@prisma/client";
// import { CreateHarvestDto } from "@shared/dto/harvest/create-harvest.dto";
// import { UpdateHarvestDto } from "@shared/dto/harvest/update-harvest.dto";

// export interface IHarvestRepository {
//   create(data: CreateHarvestDto): Promise<Harvest>;
//   findAll(): Promise<Harvest[]>;
//   findOne(id: string): Promise<Harvest | null>;
//   update(id: string, data: UpdateHarvestDto): Promise<Harvest | null>;
//   delete(id: string): Promise<void>;
//   findByStatus(status: string): Promise<Harvest[]>;
//   findByProduct(product: string): Promise<Harvest[]>;
//   findByCycle(cycle: string): Promise<Harvest[]>;
// }
