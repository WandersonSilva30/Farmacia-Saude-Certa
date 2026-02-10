import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  products: any[];
  onSearch: (results: any[]) => void;
  onCategoryFilter: (category: string) => void;
  onSortChange: (sortBy: string) => void;
}

export default function SearchBar({
  products,
  onSearch,
  onCategoryFilter,
  onSortChange,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = new Set(products?.map((p) => p.categoryId) || []);
    return Array.from(cats);
  }, [products]);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let results = products || [];

    // Filtro por busca
    if (searchTerm.trim()) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria
    if (selectedCategory !== "all") {
      results = results.filter((p) => p.categoryId === parseInt(selectedCategory));
    }

    // Ordenação
    switch (sortBy) {
      case "price-asc":
        results = [...results].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        results = [...results].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name":
        results = [...results].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return results;
  }, [searchTerm, selectedCategory, sortBy, products]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSelectSuggestion = (productName: string) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
    onSearch(filteredProducts);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryFilter(category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    onSortChange(sort);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    onSearch(products || []);
  };

  // Sugestões baseadas no termo de busca
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return filteredProducts.slice(0, 5).map((p) => p.name);
  }, [searchTerm, filteredProducts]);

  return (
    <div className="bg-white py-6 md:py-8 border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Barra de Busca Principal */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar produtos, medicamentos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-[#FF6600] focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sugestões */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 text-sm"
                >
                  <Search className="inline w-4 h-4 mr-2 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtros e Ordenação */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Filtro por Categoria */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600] text-sm"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Categoria {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600] text-sm"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>

          {/* Botão de Busca */}
          <div className="flex items-end">
            <Button
              onClick={() => onSearch(filteredProducts)}
              className="w-full md:w-auto bg-[#FF6600] hover:bg-[#E55A00] text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Buscar
            </Button>
          </div>
        </div>

        {/* Resultado da Busca */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            Encontrados <span className="font-semibold text-[#FF6600]">{filteredProducts.length}</span> produto{filteredProducts.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
