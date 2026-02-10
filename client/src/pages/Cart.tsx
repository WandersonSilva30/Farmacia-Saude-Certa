import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Trash2, ShoppingCart, ArrowLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
    toast.success("Produto removido do carrinho");
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...cartItems];
    if (quantity <= 0) {
      handleRemoveItem(index);
    } else {
      newItems[index].quantity = quantity;
      setCartItems(newItems);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Faça login para continuar");
      window.location.href = getLoginUrl();
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    setLocation("/checkout");
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6 text-[#FF6600]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Carrinho Vazio</h2>
              <p className="text-gray-600 mb-6">
                Adicione produtos para começar suas compras
              </p>
              <Button
                onClick={() => setLocation("/")}
                className="w-full bg-[#FF6600] hover:bg-[#E55A00]"
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 text-[#FF6600]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itens do Carrinho */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Carrinho de Compras ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg hover:border-[#FF6600] transition">
                    <div className="flex-1">
                      <h3 className="font-semibold">Produto #{item.productId}</h3>
                      <p className="text-sm text-gray-600">
                        R$ {parseFloat(item.price).toFixed(2)} x {item.quantity}
                      </p>
                      <p className="font-bold text-[#FF6600] mt-1">
                        R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, parseInt(e.target.value))
                        }
                        className="w-16 text-center"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Continuar Comprando */}
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="w-full mt-4 border-[#FF6600] text-[#FF6600] hover:bg-orange-50"
            >
              Continuar Comprando
            </Button>
          </div>

          {/* Resumo do Carrinho */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-[#FF6600] to-[#00A8AF]">
              <CardContent className="pt-6 text-white space-y-4">
                <div>
                  <p className="text-sm text-white/80">Subtotal</p>
                  <p className="text-3xl font-bold">R$ {subtotal.toFixed(2)}</p>
                </div>

                <div className="border-t border-white/30 pt-4">
                  <p className="text-sm text-white/80 mb-2">
                    Frete será calculado no checkout
                  </p>
                </div>

                {isAuthenticated ? (
                  <Button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-white text-[#FF6600] hover:bg-gray-100 font-bold text-lg py-6"
                  >
                    Ir para Checkout
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-white/90">
                      Faça login para continuar com a compra
                    </p>
                    <Button
                      onClick={() => (window.location.href = getLoginUrl())}
                      className="w-full bg-white text-[#FF6600] hover:bg-gray-100 font-bold"
                    >
                      Fazer Login
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900">Frete</p>
                  <p>Calculado no checkout baseado no seu CEP</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pagamento</p>
                  <p>PIX ou Cartão de Crédito</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Segurança</p>
                  <p>Seus dados são protegidos com criptografia</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
