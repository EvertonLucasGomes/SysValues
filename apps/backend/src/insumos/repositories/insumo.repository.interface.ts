import { Insumo } from "@shared/types/insumo";
import { CreateInsumoDto } from "@shared/dto/insumo/create-insumo.dto";
import { UpdateInsumoDto } from "@shared/dto/insumo/update-insumo.dto";

// NOVO TIPO: Define os parâmetros de paginação (reutilizando o padrão)
export interface PaginationParams {
  limit: number;
  offset: number; // Usamos 'offset' no backend para ser consistente com o Prisma/SQL
}

export interface InsumoRepository {
  findAll(): Promise<Insumo[]>;
  findById(id: string): Promise<Insumo | null>;
  
  // NOVO MÉTODO CORRETO (B3): Retorna [itens, total_count]
  findAndCount(params: PaginationParams): Promise<[Insumo[], number]>;
  
  create(data: CreateInsumoDto): Promise<Insumo>;
  update(id: string, data: UpdateInsumoDto): Promise<Insumo>;
  delete(id: string): Promise<void>;
}


