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
} from "./productService";
export type {
  Harvest,
  CreateHarvestRequest,
  UpdateHarvestRequest,
  //adicionados agora
  PaginatedHarvests,
  Meta,
  PaginatedResponse,
} from "./harvestService";
export type {
  SaleWithItems,
  CreateSaleRequest,
  UpdateSaleRequest,
  SaleFilters,
} from "./salesService";
export type { DashboardStatistics } from "./dashboardService";
export type { Alert, RecentActivity } from "./alertService";
// export type { Insumo } from "../../../shared/types/insumo";
export type { ApiResponse, ApiError } from "./client";

// Convenience exports (import services in components instead)
