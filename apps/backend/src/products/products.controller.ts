import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe, // ADICIONADO
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import {
  CreateProductDto,
  RawCreateProductDto,
} from "@shared/dto/product/create-product.dto";
import {
  UpdateProductDto,
  RawUpdateProductDto,
} from "@shared/dto/product/update-product.dto";
import { EProductStatus } from "@shared/enums/product.enum";
import {
  PermissionsGuard,
  RequirePermissions,
  EPermission,
} from "@shared/permissions";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequirePermissions(EPermission.CREATE_PRODUCT)
  @ApiOperation({ summary: "Criar novo produto" })
  @ApiResponse({ status: 201, description: "Produto criado com sucesso" })
  async create(@Body() rawDto: RawCreateProductDto) {
    const dto = new CreateProductDto(
      rawDto.name,
      rawDto.description || null,
      rawDto.price,
      rawDto.quantity || 0,
      rawDto.status || EProductStatus.AVAILABLE,
      rawDto.category || null
    );
    return this.productsService.create(dto);
  }

  @Get() // <--- MÉTODO PAGINADO
  @RequirePermissions(EPermission.READ_PRODUCT)
  @ApiOperation({ summary: "Listar todos os produtos (Paginado)" })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos paginada retornada com sucesso",
  })
  async findAllPaginated( // NOVO NOME do método
    // Recebe page e limit, garantindo que sejam números inteiros
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    // A chamada agora usará o novo método de serviço para lidar com a paginação
    return this.productsService.findAllPaginated(page, limit);
  }

  @Get("filter/status")
  @RequirePermissions(EPermission.READ_PRODUCT)
  @ApiOperation({ summary: "Buscar produtos por status" })
  async findByStatus(@Query("status") status: EProductStatus) {
    return this.productsService.findByStatus(status);
  }

  @Get("filter/category")
  @RequirePermissions(EPermission.READ_PRODUCT)
  @ApiOperation({ summary: "Buscar produtos por categoria" })
  async findByCategory(@Query("category") category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get(":id")
  @RequirePermissions(EPermission.READ_PRODUCT)
  @ApiOperation({ summary: "Buscar produto por ID" })
  @ApiResponse({ status: 200, description: "Produto encontrado com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @RequirePermissions(EPermission.UPDATE_PRODUCT)
  @ApiOperation({ summary: "Atualizar produto" })
  @ApiResponse({ status: 200, description: "Produto atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() rawDto: RawUpdateProductDto
  ) {
    const dto = new UpdateProductDto(
      rawDto.name,
      rawDto.description,
      rawDto.price,
      rawDto.quantity,
      rawDto.status,
      rawDto.category
    );
    return this.productsService.update(id, dto);
  }

  @Delete(":id")
  @RequirePermissions(EPermission.DELETE_PRODUCT)
  @ApiOperation({ summary: "Deletar produto" })
  @ApiResponse({ status: 200, description: "Produto deletado com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.productsService.remove(id);
    return { message: "Produto deletado com sucesso" };
  }

  @Patch(":id/stock/increase")
  @RequirePermissions(EPermission.UPDATE_PRODUCT)
  @ApiOperation({ summary: "Aumentar estoque do produto" })
  async increaseStock(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("quantity") quantity: number
  ) {
    return this.productsService.increaseStock(id, quantity);
  }

  @Patch(":id/stock/decrease")
  @RequirePermissions(EPermission.UPDATE_PRODUCT)
  @ApiOperation({ summary: "Diminuir estoque do produto" })
  async decreaseStock(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("quantity") quantity: number
  ) {
    return this.productsService.decreaseStock(id, quantity);
  }
}


