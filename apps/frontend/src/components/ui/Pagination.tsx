import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  
  // LÓGICA DE CORREÇÃO A3:
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  // Lógica para exibição do intervalo de itens
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && totalItems <= 10) {
    return null; // Não exibe a paginação se houver apenas uma página
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        {/* Botão Anteriores para telas pequenas */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Anterior
        </button>
        {/* Botão Próximos para telas pequenas */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext} // <--- A CORREÇÃO PRINCIPAL ESTÁ AQUI
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Próximo
        </button>
      </div>

      {/* Paginação para telas maiores */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startItem}</span> a <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
            (Página {currentPage} de {totalPages})
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {/* Botão ANTERIOR */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrev}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 
              ${!canGoPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="sr-only">Anterior</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Botão PRÓXIMO */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext} // <--- A CORREÇÃO PRINCIPAL ESTÁ AQUI
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 
              ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="sr-only">Próximo</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}