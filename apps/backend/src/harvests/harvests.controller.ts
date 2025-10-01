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
} from "@nestjs/common";
import { HarvestsService } from "./harvests.service";
import { CreateHarvestDto } from "@shared/dto/harvest/create-harvest.dto";
import { UpdateHarvestDto } from "@shared/dto/harvest/update-harvest.dto";
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

@ApiTags("harvests")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("harvests")
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  @RequirePermissions(EPermission.CREATE_HARVEST)
  @ApiOperation({ summary: "Criar nova colheita" })
  @ApiResponse({ status: 201, description: "Colheita criada com sucesso" })
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestsService.create(createHarvestDto);
  }

  @Get()
  @RequirePermissions(EPermission.READ_HARVEST)
  @ApiOperation({ summary: "Listar todas as colheitas" })
  @ApiResponse({ status: 200, description: "Lista de colheitas retornada" })
  findAllPaginated(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    const p = Number(page);
    const l = Number(limit);

    return this.harvestsService.findAllPaginated(p, l);
  }

  @Get(":id")
  @RequirePermissions(EPermission.READ_HARVEST)
  @ApiOperation({ summary: "Buscar colheita por ID" })
  @ApiResponse({ status: 200, description: "Colheita encontrada" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.harvestsService.findOne(id);
  }

  @Patch(":id")
  @RequirePermissions(EPermission.UPDATE_HARVEST)
  @ApiOperation({ summary: "Atualizar colheita" })
  @ApiResponse({ status: 200, description: "Colheita atualizada" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateHarvestDto: UpdateHarvestDto
  ) {
    return this.harvestsService.update(id, updateHarvestDto);
  }

  @Delete(":id")
  @RequirePermissions(EPermission.DELETE_HARVEST)
  @ApiOperation({ summary: "Excluir colheita" })
  @ApiResponse({ status: 200, description: "Colheita excluída" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.harvestsService.remove(id);
  }

  @Get("filter/status")
  @RequirePermissions(EPermission.READ_HARVEST)
  @ApiOperation({ summary: "Filtrar colheitas por status" })
  findByStatus(@Query("status") status: string) {
    return this.harvestsService.findByStatus(status);
  }

  @Get("filter/product")
  @RequirePermissions(EPermission.READ_HARVEST)
  @ApiOperation({ summary: "Filtrar colheitas por produto" })
  findByProduct(@Query("product") product: string) {
    return this.harvestsService.findByProduct(product);
  }

  @Get("filter/cycle")
  @RequirePermissions(EPermission.READ_HARVEST)
  @ApiOperation({ summary: "Filtrar colheitas por ciclo" })
  findByCycle(@Query("cycle") cycle: string) {
    return this.harvestsService.findByCycle(cycle);
  }
}
