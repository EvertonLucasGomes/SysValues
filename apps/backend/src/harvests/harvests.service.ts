import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { IHarvestRepository } from "./repositories/harvest.repository.interface";
import { HARVEST_REPOSITORY } from "./repositories/harvestToken";
import { CreateHarvestDto } from "@shared/dto/harvest/create-harvest.dto";
import { UpdateHarvestDto } from "@shared/dto/harvest/update-harvest.dto";

@Injectable()
export class HarvestsService {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: IHarvestRepository
  ) {}

  async create(createHarvestDto: CreateHarvestDto) {
    return this.harvestRepository.create(createHarvestDto);
  }

  // MÉTODO ANTIGO FINDALL() REMOVIDO E SUBSTITUÍDO POR findAllPaginated
  async findAllPaginated(page: number, limit: number) {
    // 1. Calcular o deslocamento (offset) para a página
    const offset = (page - 1) * limit;

    // 2. Assumir que o repositório tem um método para buscar itens e a contagem total.
    // Você precisa garantir que o IHarvestRepository tem este método `findAndCount`.
    const [harvests, total] = await this.harvestRepository.findAndCount({
      limit,
      offset,
    });

    // 3. Calcular o total de páginas
    const totalPages = Math.ceil(total / limit);

    // 4. Retornar no formato que o frontend espera (com metadados)
    return {
      data: harvests,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const harvest = await this.harvestRepository.findOne(id);
    if (!harvest) {
      throw new NotFoundException(`Colheita com ID ${id} não encontrada`);
    }
    return harvest;
  }

  async update(id: string, updateHarvestDto: UpdateHarvestDto) {
    const harvest = await this.harvestRepository.update(id, updateHarvestDto);
    if (!harvest) {
      throw new NotFoundException(`Colheita com ID ${id} não encontrada`);
    }
    return harvest;
  }

  async remove(id: string) {
    const harvest = await this.harvestRepository.findOne(id);
    if (!harvest) {
      throw new NotFoundException(`Colheita com ID ${id} não encontrada`);
    }
    await this.harvestRepository.delete(id);
  }

  async findByStatus(status: string) {
    return this.harvestRepository.findByStatus(status);
  }

  async findByProduct(product: string) {
    return this.harvestRepository.findByProduct(product);
  }

  async findByCycle(cycle: string) {
    return this.harvestRepository.findByCycle(cycle);
  }
}


// import { Injectable, Inject, NotFoundException } from "@nestjs/common";
// import { IHarvestRepository } from "./repositories/harvest.repository.interface";
// import { HARVEST_REPOSITORY } from "./repositories/harvestToken";
// import { CreateHarvestDto } from "@shared/dto/harvest/create-harvest.dto";
// import { UpdateHarvestDto } from "@shared/dto/harvest/update-harvest.dto";

// @Injectable()
// export class HarvestsService {
//   constructor(
//     @Inject(HARVEST_REPOSITORY)
//     private readonly harvestRepository: IHarvestRepository
//   ) {}

//   async create(createHarvestDto: CreateHarvestDto) {
//     return this.harvestRepository.create(createHarvestDto);
//   }

//   async findAll() {
//     return this.harvestRepository.findAll();
//   }

//   async findOne(id: string) {
//     const harvest = await this.harvestRepository.findOne(id);
//     if (!harvest) {
//       throw new NotFoundException(`Colheita com ID ${id} não encontrada`);
//     }
//     return harvest;
//   }

//   async update(id: string, updateHarvestDto: UpdateHarvestDto) {
//     const harvest = await this.harvestRepository.update(id, updateHarvestDto);
//     if (!harvest) {
//       throw new NotFoundException(`Colheita com ID ${id} não encontrada`);
//     }
//     return harvest;
//   }

//   async remove(id: string) {
//     const harvest = await this.harvestRepository.findOne(id);
//     if (!harvest) {
//       throw new NotFoundException(`Colheita com ID ${id} não encontrada`);
//     }
//     await this.harvestRepository.delete(id);
//   }

//   async findByStatus(status: string) {
//     return this.harvestRepository.findByStatus(status);
//   }

//   async findByProduct(product: string) {
//     return this.harvestRepository.findByProduct(product);
//   }

//   async findByCycle(cycle: string) {
//     return this.harvestRepository.findByCycle(cycle);
//   }
// }
