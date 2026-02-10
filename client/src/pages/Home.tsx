import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Pill, Heart, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: products } = trpc.products.list.useQuery();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (results: any[]) => {
    setDisplayedProducts(results);
    setHasSearched(true);
  };

  const handleCategoryFilter = (category: string) => {
    // Filtro será aplicado pelo componente SearchBar
  };

  const handleSortChange = (sortBy: string) => {
    // Ordenação será aplicada pelo componente SearchBar
  };

  const productsToDisplay = hasSearched ? displayedProducts : (products || []);

  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    localStorage.setItem(
      "cartItems",
      JSON.stringify([
        ...cartItems,
        existingItem
          ? { ...existingItem, quantity: existingItem.quantity + 1 }
          : { ...product, quantity: 1 },
      ])
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6600] to-[#00A8AF] rounded-lg flex items-center justify-center flex-shrink-0">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Farmácia Saude Certa</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <span className="text-xs md:text-sm text-gray-700 hidden sm:inline">Olá, {user?.name}</span>
                <Button
                  onClick={() => setLocation("/profile")}
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  Minha Conta
                </Button>
                {user?.role === "admin" && (
                  <>
                    <Button
                      onClick={() => setLocation("/admin")}
                      variant="outline"
                      size="sm"
                      className="hidden lg:inline-flex"
                    >
                      Painel Admin
                    </Button>
                    <Button
                      onClick={() => setLocation("/dashboard")}
                      variant="outline"
                      size="sm"
                      className="hidden lg:inline-flex"
                    >
                      Relatórios
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
            <Button
              onClick={() => setLocation("/cart")}
              variant="ghost"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF6600] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF6600] to-[#00A8AF] text-white py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 leading-tight">
                Farmácia Saude Certa
              </h2>
              <p className="text-base md:text-xl mb-6 md:mb-8 opacity-95">
                Seus medicamentos e produtos de saúde com qualidade, confiança e preços especiais
              </p>
              <Button
                size="lg"
                className="bg-white text-[#FF6600] hover:bg-gray-50 font-semibold"
                onClick={() => document.querySelector("#produtos")?.scrollIntoView({ behavior: "smooth" })}
              >
                Começar a Comprar
              </Button>
            </div>
            <div className="hidden md:flex justify-center">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663169182674/dVLcxVpTRWkvMRpA.jpg"
                alt="Mascote Farmácia Saúde Certa"
                className="w-full max-w-sm drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Busca */}
      <SearchBar
        products={products || []}
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onSortChange={handleSortChange}
      />

      {/* Categorias */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center text-gray-900">
            Categorias Principais
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              { icon: Pill, title: "Medicamentos", color: "#FF6600" },
              { icon: Heart, title: "Saúde", color: "#00A8AF" },
              { icon: Package, title: "Higiene", color: "#FF6600" },
              { icon: Heart, title: "Bem-estar", color: "#00A8AF" },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="group">
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 text-center cursor-pointer border border-gray-100">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full" style={{ backgroundColor: cat.color + "20" }}>
                        <Icon className="w-8 h-8" style={{ color: cat.color }} />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{cat.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section id="produtos" className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center text-gray-900">
            {hasSearched ? "Resultados da Busca" : "Produtos em Destaque"}
          </h3>
          {productsToDisplay.length === 0 && hasSearched && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum produto encontrado. Tente outra busca.</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {(hasSearched ? productsToDisplay : products?.slice(0, 8))?.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-[#FF6600]">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#00A8AF] hover:bg-[#0096A3] text-white font-medium"
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Avaliações */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">O que Nossos Clientes Dizem</h2>
            <p className="text-gray-600 text-base md:text-lg">Avaliações reais de clientes satisfeitos com nossos produtos e serviços</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Avaliações de Exemplo */}
            <ReviewCard
              author="Maria Silva"
              rating={5}
              comment="Excelente atendimento! Os produtos são de ótima qualidade e os preços são muito justos. Recomendo para todos os meus amigos e familiares."
              date="Há 2 dias"
            />
            <ReviewCard
              author="João Santos"
              rating={5}
              comment="Farmácia confiável com ótimo atendimento. Sempre encontro o que procuro e o staff é muito prestativo e educado."
              date="Há 1 semana"
            />
            <ReviewCard
              author="Ana Costa"
              rating={4}
              comment="Muito bom! Variedade de produtos e preços competitivos. Só gostaria que tivessem mais opções de marcas."
              date="Há 10 dias"
            />
            <ReviewCard
              author="Pedro Oliveira"
              rating={5}
              comment="Melhor farmácia da região! Sempre voltarei. Atendimento de primeira qualidade e produtos originais."
              date="Há 3 semanas"
            />
          </div>

          {/* Formulário de Avaliação */}
          {isAuthenticated ? (
            <div className="max-w-2xl mx-auto">
              <ReviewForm />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-700 mb-4">Faça login para deixar sua avaliação e ajudar outros clientes!</p>
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-[#FF6600] hover:bg-[#E55A00] text-white font-semibold px-6 py-2"
              >
                Fazer Login
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6 md:mb-8">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663169182674/dVLcxVpTRWkvMRpA.jpg"
              alt="Mascote"
              className="w-20 md:w-24 h-20 md:h-24 object-contain"
            />
          </div>
          {/* Localização */}
          <div className="mb-8">
            <h4 className="font-bold mb-4 text-white text-sm md:text-base">Nossa Localização</h4>
            <div className="bg-gray-800 rounded-lg p-4 md:p-6">
              <p className="text-gray-300 text-sm md:text-base mb-4">
                R. Vinte e Seis, 05 - Cohab<br />
                Cabo de Santo Agostinho - PE, 54520-235
              </p>
              <a
                href="https://maps.google.com/?q=R.+Vinte+e+Seis,+05+-+Cohab,+Cabo+de+Santo+Agostinho+-+PE,+54520-235"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FF6600] hover:bg-[#E55A00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Ver no Google Maps
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-8">
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-white text-sm md:text-base">Sobre Nós</h4>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                Farmácia Saude Certa: Qualidade, confiança e atendimento ao cliente desde 2020.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-white text-sm md:text-base">Links Úteis</h4>
              <ul className="text-gray-400 space-y-2 text-xs md:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-white text-sm md:text-base">Contato</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                Email: erikabarbosaadelinodeoliveira@gmail.com
                <br />
                Telefone: (81) 93816-0087
                <br />
                <br />
                <strong className="text-white">Endereço:</strong>
                <br />
                R. Vinte e Seis, 05 - Cohab
                <br />
                Cabo de Santo Agostinho - PE
                <br />
                CEP: 54520-235
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
            <p>&copy; 2026 Farmácia Saude Certa. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
