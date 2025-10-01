import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query, // Importe o decorador Query aqui
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { InsumosService } from "./insumos.service";
import { CreateInsumoDto } from "@shared/dto/insumo/create-insumo.dto";
import { UpdateInsumoDto } from "@shared/dto/insumo/update-insumo.dto";
import { Insumo } from "@shared/types/insumo";

@Controller("insumos")
@UseGuards(JwtAuthGuard)
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ data: Insumo[], total: number }> {
    // Altere o tipo de retorno para coincidir com o do serviço
    return this.insumosService.findAllPaginated(page, limit);
  }
  // @Get()
  // async findAll(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10
  // ): Promise<Insumo[]> {
  //   // A chamada agora usará um novo método de serviço para lidar com a paginação
  //   return this.insumosService.findAllPaginated(page, limit);
  // }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Insumo | null> {
    return this.insumosService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateInsumoDto): Promise<Insumo> {
    return this.insumosService.create(data);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: UpdateInsumoDto
  ): Promise<Insumo> {
    return this.insumosService.update(id, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    return this.insumosService.delete(id);
  }
}



// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   UseGuards,
// } from "@nestjs/common";
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
// import { InsumosService } from "./insumos.service";
// import { CreateInsumoDto } from "@shared/dto/insumo/create-insumo.dto";
// import { UpdateInsumoDto } from "@shared/dto/insumo/update-insumo.dto";
// import { Insumo } from "@shared/types/insumo";

// @Controller("insumos")
// @UseGuards(JwtAuthGuard)
// export class InsumosController {
//   constructor(private readonly insumosService: InsumosService) {}

//   @Get()
//   async findAll(): Promise<Insumo[]> {
//     return this.insumosService.findAll();
//   }

//   @Get(":id")
//   async findById(@Param("id") id: string): Promise<Insumo | null> {
//     return this.insumosService.findById(id);
//   }

//   @Post()
//   async create(@Body() data: CreateInsumoDto): Promise<Insumo> {
//     return this.insumosService.create(data);
//   }

//   @Put(":id")
//   async update(
//     @Param("id") id: string,
//     @Body() data: UpdateInsumoDto
//   ): Promise<Insumo> {
//     return this.insumosService.update(id, data);
//   }

//   @Delete(":id")
//   async delete(@Param("id") id: string): Promise<void> {
//     return this.insumosService.delete(id);
//   }
// }
