import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateSaleDto } from "@shared/dto/sale/create-sale.dto";
import { UpdateSaleDto } from "@shared/dto/sale/update-sale.dto";
import { ISaleRepository, PaginationParams } from "../sale.repository.interface"; // <-- Importado PaginationParams
import { SaleWithItems } from "@shared/types/product";
import { ESaleStatus, SaleStatus } from "@shared/enums/product.enum";

// Mapeamento entre enums
const statusMap = {
  [SaleStatus.PENDING]: ESaleStatus.PENDING,
  [SaleStatus.COMPLETED]: ESaleStatus.COMPLETED,
  [SaleStatus.CANCELLED]: ESaleStatus.CANCELLED,
};

const reverseStatusMap = {
  [ESaleStatus.PENDING]: SaleStatus.PENDING,
  [ESaleStatus.COMPLETED]: SaleStatus.COMPLETED,
  [ESaleStatus.CANCELLED]: SaleStatus.CANCELLED,
};

const saleSelect = {
  id: true,
  uapId: true,
  totalAmount: true,
  status: true,
  saleDate: true,
  createdAt: true,
  updatedAt: true,
  uap: {
    select: {
      id: true,
      name: true,
      location: true,
      responsible: true,
    },
  },
  saleItems: {
    select: {
      id: true,
      saleId: true,
      productId: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  },
};

function toDomainSale(prismaSale: any): SaleWithItems {
  return {
    ...prismaSale,
    totalAmount: Number(prismaSale.totalAmount),
    status: statusMap[prismaSale.status],
    saleItems: prismaSale.saleItems.map((item: any) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
  };
}

@Injectable()
export class SaleRepositoryPostgres implements ISaleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<SaleWithItems[]> {
    const sales = await this.prisma.sale.findMany({
      select: saleSelect,
      orderBy: { createdAt: "desc" },
    });
    return sales.map(toDomainSale);
  }
  
  // NOVO MÉTODO ADICIONADO PARA PAGINAÇÃO
  async findAndCount({ limit, offset }: PaginationParams): Promise<[SaleWithItems[], number]> {
    // 1. Buscamos os itens da página atual (usando take e skip)
    const sales = await this.prisma.sale.findMany({
      take: limit, // 'take' no Prisma é o nosso 'limit'
      skip: offset, // 'skip' no Prisma é o nosso 'offset'
      select: saleSelect,
      orderBy: { createdAt: "desc" },
    });

    // 2. Contamos o total de itens no banco de dados (sem filtro de paginação)
    const total = await this.prisma.sale.count();

    // 3. Retornamos [os dados da página, o total geral]
    return [sales.map(toDomainSale), total];
  }


  async findOne(id: string): Promise<SaleWithItems | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      select: saleSelect,
    });
    return sale ? toDomainSale(sale) : null;
  }

  async findById(id: string): Promise<SaleWithItems | null> {
    return this.findOne(id);
  }

  async findByUapId(uapId: string): Promise<SaleWithItems[]> {
    const sales = await this.prisma.sale.findMany({
      where: { uapId },
      select: saleSelect,
      orderBy: { createdAt: "desc" },
    });
    return sales.map(toDomainSale);
  }

  async findByStatus(status: ESaleStatus): Promise<SaleWithItems[]> {
    const sales = await this.prisma.sale.findMany({
      where: { status: reverseStatusMap[status] },
      select: saleSelect,
      orderBy: { createdAt: "desc" },
    });
    return sales.map(toDomainSale);
  }

  async create(data: CreateSaleDto): Promise<SaleWithItems> {
    const sale = await this.prisma.sale.create({
      data: {
        uapId: data.uapId,
        totalAmount: data.totalAmount,
        status: reverseStatusMap[data.status],
        saleDate: data.saleDate,
        saleItems: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      select: saleSelect,
    });
    return toDomainSale(sale);
  }

  async update(id: string, data: UpdateSaleDto): Promise<SaleWithItems | null> {
    const updateData: any = {};

    if (data.status !== undefined)
      updateData.status = reverseStatusMap[data.status];
    if (data.saleDate !== undefined) updateData.saleDate = data.saleDate;

    const sale = await this.prisma.sale.update({
      where: { id },
      data: updateData,
      select: saleSelect,
    });
    return toDomainSale(sale);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sale.delete({ where: { id } });
  }
}





