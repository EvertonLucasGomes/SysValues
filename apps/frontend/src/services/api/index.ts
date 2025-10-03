// Export main services
export { authService, AuthService } from "./authService";
export { toolService, ToolService } from "./toolService";
export { userService, UserService } from "./userService";
export { invoiceService, InvoiceService } from "./invoiceService";
export { productService, ProductService } from "./productService";
export { harvestService, HarvestService } from "./harvestService";
export { salesService, SalesService } from "./salesService";
export { uapService } from "./uapService";
export { inputMaterialService } from "./inputMaterialService";
export { dashboardService, DashboardService } from "./dashboardService";
export { alertService, AlertService } from "./alertService";
export { insumoService } from "./insumoService";
export { apiClient } from "./client";

// Export types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "./authService";
export type {
  Tool,
  CreateToolRequest,
  UpdateToolRequest,
  ToolsFilters,
} from "./toolService";
export type {
  CreateUserRequest,
  UpdateUserRequest,
  UsersFilters,
} from "./userService";
export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsFilters,
  PaginatedProducts // <-- CORRETO
} from "./productService";
export type {
  Harvest,
  CreateHarvestRequest,
  UpdateHarvestRequest,
  //adicionados agora
  PaginatedHarvests,
  Meta,
  PaginatedResponse, // <-- TIPO BASE DE PAGINAÇÃO
} from "./harvestService";
export type {
  SaleWithItems,
  CreateSaleRequest,
  UpdateSaleRequest,
  SaleFilters,
  PaginatedSales, // <-- CORRETO
} from "./salesService";
export type { DashboardStatistics } from "./dashboardService";
export type { Alert, RecentActivity } from "./alertService";

// CORREÇÃO FINAL: Centralizamos a exportação dos tipos de Insumo no SERVICE
export type {
  Insumo,
  CreateInsumoDto,
  UpdateInsumoDto,
  EUnit // <--- ADICIONADO EUNIT AQUI (Se ele estiver no insumoService.ts, senão use o caminho do shared)
} from "./insumoService"; // <-- IMPORTANDO DO SERVIÇO, NÃO DE CAMINHO LONGO

export type { ApiResponse, ApiError } from "./client";

export type { PaginatedInsumos } from "./insumoService";