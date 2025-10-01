import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { 
    IHarvestRepository, 
    PaginationParams // <-- NOVO: Certifique-se de que está importado da interface
} from "../harvest.repository.interface";
import { CreateHarvestDto } from "@shared/dto/harvest/create-harvest.dto";
import { UpdateHarvestDto } from "@shared/dto/harvest/update-harvest.dto";
import { Harvest } from "@prisma/client";

@Injectable()
export class HarvestRepositoryPostgres implements IHarvestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateHarvestDto): Promise<Harvest> {
    return this.prisma.harvest.create({
      data: {
        harvestDate: new Date(data.harvestDate),
        product: data.product,
        quantity: data.quantity,
        unit: data.unit,
        uap: data.uap,
        responsible: data.responsible,
        cycle: data.cycle,
        status: data.status as any,
        equipment: data.equipment,
        observations: data.observations,
      },
    });
  }

  async findAll(): Promise<Harvest[]> {
    return this.prisma.harvest.findMany({
      orderBy: { harvestDate: "desc" },
    });
  }

  // MÉTODO ADICIONADO PARA PAGINAÇÃO
  async findAndCount({ limit, offset }: PaginationParams): Promise<[Harvest[], number]> {
    // 1. Buscamos os itens da página atual (usando take e skip)
    const harvests = await this.prisma.harvest.findMany({
      take: limit, // 'take' no Prisma é o nosso 'limit'
      skip: offset, // 'skip' no Prisma é o nosso 'offset'
      orderBy: { harvestDate: "desc" },
    });

    // 2. Contamos o total de itens no banco de dados (sem filtro de paginação)
    const total = await this.prisma.harvest.count();

    // 3. Retornamos [os dados da página, o total geral]
    return [harvests, total];
  }

  async findOne(id: string): Promise<Harvest | null> {
    return this.prisma.harvest.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateHarvestDto): Promise<Harvest | null> {
    const updateData: any = {};

    if (data.harvestDate) {
      updateData.harvestDate = new Date(data.harvestDate);
    }
    if (data.product) updateData.product = data.product;
    if (data.quantity) updateData.quantity = data.quantity;
    if (data.unit) updateData.unit = data.unit;
    if (data.uap) updateData.uap = data.uap;
    if (data.responsible) updateData.responsible = data.responsible;
    if (data.cycle) updateData.cycle = data.cycle;
    if (data.status) updateData.status = data.status as any;
    if (data.equipment !== undefined) updateData.equipment = data.equipment;
    if (data.observations !== undefined)
      updateData.observations = data.observations;

    return this.prisma.harvest.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.harvest.delete({
      where: { id },
    });
  }

  async findByStatus(status: string): Promise<Harvest[]> {
    return this.prisma.harvest.findMany({
      where: { status: status as any },
      orderBy: { harvestDate: "desc" },
    });
  }

  async findByProduct(product: string): Promise<Harvest[]> {
    return this.prisma.harvest.findMany({
      where: { product },
      orderBy: { harvestDate: "desc" },
    });
  }

  async findByCycle(cycle: string): Promise<Harvest[]> {
    return this.prisma.harvest.findMany({
      where: { cycle },
      orderBy: { harvestDate: "desc" },
    });
  }
}







// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "../../../prisma/prisma.service";
// import { IHarvestRepository } from "../harvest.repository.interface";
// import { CreateHarvestDto } from "@shared/dto/harvest/create-harvest.dto";
// import { UpdateHarvestDto } from "@shared/dto/harvest/update-harvest.dto";
// import { Harvest } from "@prisma/client";

// @Injectable()
// export class HarvestRepositoryPostgres implements IHarvestRepository {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(data: CreateHarvestDto): Promise<Harvest> {
//     return this.prisma.harvest.create({
//       data: {
//         harvestDate: new Date(data.harvestDate),
//         product: data.product,
//         quantity: data.quantity,
//         unit: data.unit,
//         uap: data.uap,
//         responsible: data.responsible,
//         cycle: data.cycle,
//         status: data.status as any,
//         equipment: data.equipment,
//         observations: data.observations,
//       },
//     });
//   }

//   async findAll(): Promise<Harvest[]> {
//     return this.prisma.harvest.findMany({
//       orderBy: { harvestDate: "desc" },
//     });
//   }

//   async findOne(id: string): Promise<Harvest | null> {
//     return this.prisma.harvest.findUnique({
//       where: { id },
//     });
//   }

//   async update(id: string, data: UpdateHarvestDto): Promise<Harvest | null> {
//     const updateData: any = {};

//     if (data.harvestDate) {
//       updateData.harvestDate = new Date(data.harvestDate);
//     }
//     if (data.product) updateData.product = data.product;
//     if (data.quantity) updateData.quantity = data.quantity;
//     if (data.unit) updateData.unit = data.unit;
//     if (data.uap) updateData.uap = data.uap;
//     if (data.responsible) updateData.responsible = data.responsible;
//     if (data.cycle) updateData.cycle = data.cycle;
//     if (data.status) updateData.status = data.status as any;
//     if (data.equipment !== undefined) updateData.equipment = data.equipment;
//     if (data.observations !== undefined)
//       updateData.observations = data.observations;

//     return this.prisma.harvest.update({
//       where: { id },
//       data: updateData,
//     });
//   }

//   async delete(id: string): Promise<void> {
//     await this.prisma.harvest.delete({
//       where: { id },
//     });
//   }

//   async findByStatus(status: string): Promise<Harvest[]> {
//     return this.prisma.harvest.findMany({
//       where: { status: status as any },
//       orderBy: { harvestDate: "desc" },
//     });
//   }

//   async findByProduct(product: string): Promise<Harvest[]> {
//     return this.prisma.harvest.findMany({
//       where: { product },
//       orderBy: { harvestDate: "desc" },
//     });
//   }

//   async findByCycle(cycle: string): Promise<Harvest[]> {
//     return this.prisma.harvest.findMany({
//       where: { cycle },
//       orderBy: { harvestDate: "desc" },
//     });
//   }
// }
