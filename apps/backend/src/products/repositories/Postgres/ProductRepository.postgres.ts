import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateProductDto } from "@shared/dto/product/create-product.dto";
import { UpdateProductDto } from "@shared/dto/product/update-product.dto";
// Importa a Interface e o PaginationParams
import { IProductRepository, PaginationParams } from "../product.repository.interface"; 
import { Product } from "@shared/types/product";
import { EProductStatus, ProductStatus } from "@shared/enums/product.enum";

// Mapeamento entre enums (mantido)
const statusMap = {
  [ProductStatus.AVAILABLE]: EProductStatus.AVAILABLE,
  [ProductStatus.OUT_OF_STOCK]: EProductStatus.OUT_OF_STOCK,
  [ProductStatus.DISCONTINUED]: EProductStatus.DISCONTINUED,
};

const reverseStatusMap = {
  [EProductStatus.AVAILABLE]: ProductStatus.AVAILABLE,
  [EProductStatus.OUT_OF_STOCK]: ProductStatus.OUT_OF_STOCK,
  [EProductStatus.DISCONTINUED]: ProductStatus.DISCONTINUED,
};

function toDomainProduct(prismaProduct: any): Product {
  return {
    ...prismaProduct,
    price: Number(prismaProduct.price),
    status: statusMap[prismaProduct.status],
  };
}

@Injectable()
export class ProductRepositoryPostgres implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products.map(toDomainProduct);
  }

  // NOVO MÉTODO PAGINADO (B3): findAndCount
  async findAndCount({ limit, offset }: PaginationParams): Promise<[Product[], number]> {
    // 1. Executamos a busca paginada e a contagem total de forma otimizada
    const [productRecords, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip: offset, // Usa 'offset' do PaginationParams
        take: limit,  // Usa 'limit' do PaginationParams
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.product.count(), // 2. Contagem total
    ]);

    // 3. Retornamos a tupla [itens mapeados para o domínio, contagem total]
    return [productRecords.map(toDomainProduct), total];
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? toDomainProduct(product) : null;
  }

  async findById(id: string): Promise<Product | null> {
    return this.findOne(id);
  }

  async findByStatus(status: EProductStatus): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { status: reverseStatusMap[status] },
      orderBy: { createdAt: "desc" },
    });
    return products.map(toDomainProduct);
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
    });
    return products.map(toDomainProduct);
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        status: reverseStatusMap[data.status],
        category: data.category,
      },
    });
    return toDomainProduct(product);
  }

  async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.status !== undefined)
      updateData.status = reverseStatusMap[data.status];
    if (data.category !== undefined) updateData.category = data.category;

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });
    return toDomainProduct(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}

