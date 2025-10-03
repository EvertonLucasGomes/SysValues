import { useCallback } from "react";
import {
  productService,
  type CreateProductRequest,
  type UpdateProductRequest,
  type Product,
  type PaginatedProducts,
} from "../services/api";

import { usePaginatedFetch, type PaginatedFetchResult } from "./usePaginatedFetch"; // Hook Genérico

// 1. Interface de Retorno: Estende o tipo genérico e mantém compatibilidade
export interface UseProductResult extends Omit<PaginatedFetchResult<Product>, 'data' | 'refresh'> {
  products: Product[];
  refreshProducts: () => void;
  // ADICIONADO: Mantém o contrato da função fetchProducts original (que a UI pode ainda chamar)
  fetchProducts: () => void; 
  createProduct: (productData: CreateProductRequest) => Promise<void>;
  updateProduct: (
    id: string,
    productData: UpdateProductRequest
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
}

export function useProduct(): UseProductResult {
  
  // 2. FUNÇÃO WRAPPER: Adapta a chamada do serviço para o hook genérico
  const fetchProductsPaginated = useCallback(
    (page: number, limit: number): Promise<PaginatedProducts> => {
      return productService.getAllProducts(page, limit);
    },
    []
  );

  // 3. USO DO HOOK GENÉRICO: Delega toda a complexidade de paginação, loading e error
  const {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
    refresh // Capturamos a função refresh do hook genérico
  } = usePaginatedFetch<Product>({
    fetchFn: fetchProductsPaginated,
    initialLimit: 10,
  });
  
  // 4. ALIASES: Mantém a compatibilidade de nomes com a página de UI
  const refreshProducts = refresh;
  
  // CORREÇÃO: Mapeia o refresh para o nome antigo fetchProducts
  const fetchProducts = refresh; 
  
  // --- LÓGICA DE AÇÕES (Simplificada) ---

  const createProduct = useCallback(
    async (productData: CreateProductRequest) => {
      try {
        await productService.createProduct(productData);
        refreshProducts(); 
      } catch (err) {
        throw err;
      }
    },
    [refreshProducts]
  );

  const updateProduct = useCallback(
    async (id: string, productData: UpdateProductRequest) => {
      try {
        await productService.updateProduct(id, productData);
        refreshProducts();
      } catch (err) {
        throw err;
      }
    },
    [refreshProducts]
  );

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productService.deleteProduct(id);
      refreshProducts();
    } catch (err) {
      throw err;
    }
  }, [refreshProducts]);

  // Mantido para satisfazer o contrato de tipo
  const searchProducts = useCallback(async (query: string) => {
    console.log(`Função searchProducts chamada com query: ${query}. Necessita de implementação paginada.`);
  }, []); 

  const getProductById = useCallback(
    async (id: string): Promise<Product | null> => {
      return productService.getProductById(id);
    },
    []
  );

  // --- RETORNO FINAL: Mantém a assinatura EXATA ---
  return {
    products: data, 
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage,
    
    // Funções do hook específico
    fetchProducts, // <-- EXPOSTO PARA CORRIGIR O ERRO DA PÁGINA
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductById,
  };
}





// import { useCallback } from "react";
// import {
//   productService,
//   type CreateProductRequest,
//   type UpdateProductRequest,
//   type Product,
//   type PaginatedProducts,
// } from "../services/api";

// import { usePaginatedFetch, type PaginatedFetchResult } from "./usePaginatedFetch"; // Hook Genérico

// // 1. Interface de Retorno: Estende o tipo genérico e mantém compatibilidade
// export interface UseProductResult extends Omit<PaginatedFetchResult<Product>, 'data' | 'refresh'> {
//   products: Product[];
//   refreshProducts: () => void;
//   createProduct: (productData: CreateProductRequest) => Promise<void>;
//   updateProduct: (
//     id: string,
//     productData: UpdateProductRequest
//   ) => Promise<void>;
//   deleteProduct: (id: string) => Promise<void>;
//   searchProducts: (query: string) => Promise<void>; // Contrato de retorno
//   getProductById: (id: string) => Promise<Product | null>;
// }

// export function useProduct(): UseProductResult {
  
//   // 2. FUNÇÃO WRAPPER: Adapta a chamada do serviço para o hook genérico
//   const fetchProductsPaginated = useCallback(
//     (page: number, limit: number): Promise<PaginatedProducts> => {
//       // Chama a função paginada que criamos no productService.ts
//       return productService.getAllProducts(page, limit);
//     },
//     []
//   );

//   // 3. USO DO HOOK GENÉRICO: Delega toda a complexidade de paginação, loading e error
//   const {
//     data,
//     loading,
//     error,
//     currentPage,
//     totalPages,
//     itemsPerPage,
//     totalItems,
//     setPage,
//     refresh // Capturamos a função refresh do hook genérico
//   } = usePaginatedFetch<Product>({
//     fetchFn: fetchProductsPaginated,
//     initialLimit: 10,
//   });
  
//   // 4. ALIAS: Renomeia 'refresh' para 'refreshProducts'
//   const refreshProducts = refresh;

//   // --- LÓGICA DE AÇÕES (Simplificada) ---

//   const createProduct = useCallback(
//     async (productData: CreateProductRequest) => {
//       try {
//         await productService.createProduct(productData);
//         refreshProducts(); 
//       } catch (err) {
//         throw err;
//       }
//     },
//     [refreshProducts]
//   );

//   const updateProduct = useCallback(
//     async (id: string, productData: UpdateProductRequest) => {
//       try {
//         await productService.updateProduct(id, productData);
//         refreshProducts();
//       } catch (err) {
//         throw err;
//       }
//     },
//     [refreshProducts]
//   );

//   const deleteProduct = useCallback(async (id: string) => {
//     try {
//       await productService.deleteProduct(id);
//       refreshProducts();
//     } catch (err) {
//       throw err;
//     }
//   }, [refreshProducts]);

//   // CORREÇÃO: Função searchProducts precisa ser uma const ou declarada externamente
//   // e usada no return. Como a lógica de paginação quebrou o uso dela, 
//   // vamos redefinir a constante para o console.log (a opção mais segura)
//   const searchProducts = useCallback(async (query: string) => {
//     // Mantém a assinatura assíncrona do contrato original
//     console.log(`Função searchProducts chamada com query: ${query}. Necessita de implementação paginada.`);
//   }, []); 

//   const getProductById = useCallback(
//     async (id: string): Promise<Product | null> => {
//       return productService.getProductById(id);
//     },
//     []
//   );

//   // --- RETORNO FINAL: Mantém a assinatura EXATA ---
//   return {
//     products: data, 
//     loading,
//     error,
//     currentPage,
//     totalPages,
//     itemsPerPage,
//     totalItems,
//     setPage,
    
//     // Funções do hook específico
//     refreshProducts,
//     createProduct,
//     updateProduct,
//     deleteProduct,

//     // CORREÇÃO FINAL: Usamos a constante que definimos acima
//     searchProducts, 

//     getProductById,
//   };
// }



