import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, QrCode, CreditCard, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [cep, setCep] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "pix">("stripe");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");

  const { data: addresses } = trpc.addresses.list.useQuery(undefined as any);
  const createPixPayment = trpc.payments.createPixPayment.useMutation();
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  // Proteger rota - redirecionar se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para acessar o checkout");
      setLocation("/");
      return;
    }

    const saved = localStorage.getItem("cartItems");
    if (saved) {
      const items = JSON.parse(saved);
      if (items.length === 0) {
        setLocation("/cart");
        return;
      }
      setCartItems(items);
    } else {
      setLocation("/cart");
    }
  }, [isAuthenticated, setLocation]);

  const handleCalculateShipping = () => {
    if (!cep || cep.length < 8) {
      toast.error("CEP inválido. Use o formato: 12345-678");
      return;
    }

    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    setIsCalculatingShipping(true);
    // Cálculo simplificado: R$ 5 a cada 10km
    const baseCep = "54520235"; // CEP da farmácia
    const userCep = cep.replace(/\D/g, "");
    
    const distance = Math.abs(parseInt(baseCep) - parseInt(userCep)) / 200;
    const cost = Math.max(Math.ceil(distance / 10) * 5, 5);
    
    setShippingCost(cost);
    setIsCalculatingShipping(false);
    toast.success(`Frete calculado: R$ ${cost.toFixed(2)}`);
  };

  const handlePaymentClick = async () => {
    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    if (shippingCost === 0) {
      toast.error("Calcule o frete antes de continuar");
      return;
    }

    if (!customerPhone) {
      toast.error("Informe seu telefone para contato");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "pix") {
        const result = await createPixPayment.mutateAsync({
          items: cartItems,
          addressId: selectedAddress,
          shippingCost,
          customerPhone,
        });

        if (result.whatsappLink) {
          window.open(result.whatsappLink, "_blank");
          toast.success("Abra o WhatsApp para confirmar seu pedido!");
          localStorage.removeItem("cartItems");
          setCartItems([]);
          setLocation("/orders");
        }
      } else {
        const result = await createCheckoutSession.mutateAsync({
          items: cartItems,
          addressId: selectedAddress,
        });

        if (result.checkoutUrl) {
          window.open(result.checkoutUrl, "_blank");
          toast.success("Redirecionando para pagamento...");
        }
      }
    } catch (error) {
      toast.error("Erro ao processar pagamento");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">Você precisa estar logado para acessar o checkout</p>
            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-[#FF6600] hover:bg-[#E55A00]"
            >
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/cart")}
          className="mb-6 text-[#FF6600]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Carrinho
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2 space-y-6">
            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                {addresses && addresses.length > 0 ? (
                  <select
                    value={selectedAddress || ""}
                    onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="">Selecione um endereço</option>
                    {addresses.map((addr: any) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.street}, {addr.number} - {addr.city}, {addr.state}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-600">
                    Nenhum endereço cadastrado. Vá para{" "}
                    <Button
                      variant="link"
                      onClick={() => setLocation("/profile")}
                      className="text-[#FF6600]"
                    >
                      Minha Conta
                    </Button>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Cálculo de Frete */}
            <Card>
              <CardHeader>
                <CardTitle>Cálculo de Frete</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">CEP de Entrega</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="12345-678"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCalculateShipping}
                      disabled={isCalculatingShipping || !selectedAddress}
                      className="bg-[#00A8AF] hover:bg-[#0096A3]"
                    >
                      {isCalculatingShipping ? "..." : "Calcular"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Frete: R$ 5,00 a cada 10km (mínimo R$ 5,00)
                  </p>
                </div>

                {shippingCost > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 font-semibold">
                      ✓ Frete calculado: R$ {shippingCost.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Telefone */}
            <Card>
              <CardHeader>
                <CardTitle>Telefone para Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="(81) 98765-4321"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label
                  className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition"
                  style={{
                    borderColor: paymentMethod === "stripe" ? "#FF6600" : "#E5E7EB",
                    backgroundColor: paymentMethod === "stripe" ? "#FFF5F0" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#FF6600]" />
                    <div>
                      <p className="font-semibold">Cartão de Crédito</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
                    </div>
                  </div>
                </label>

                <label
                  className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition"
                  style={{
                    borderColor: paymentMethod === "pix" ? "#00A8AF" : "#E5E7EB",
                    backgroundColor: paymentMethod === "pix" ? "#F0FFFE" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={paymentMethod === "pix"}
                    onChange={() => setPaymentMethod("pix")}
                  />
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#00A8AF]" />
                    <div>
                      <p className="font-semibold">PIX</p>
                      <p className="text-sm text-gray-600">Transferência instantânea</p>
                    </div>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Resumo de Itens */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>Produto #{item.productId} x {item.quantity}</span>
                    <span className="font-semibold">
                      R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumo e Botão de Pagamento */}
          <div>
            <Card className="bg-gradient-to-br from-[#FF6600] to-[#00A8AF] sticky top-8">
              <CardContent className="pt-6 text-white space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete:</span>
                    <span>R$ {shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePaymentClick}
                  disabled={
                    isProcessing ||
                    cartItems.length === 0 ||
                    shippingCost === 0 ||
                    !selectedAddress ||
                    !customerPhone
                  }
                  className="w-full bg-white text-[#FF6600] hover:bg-gray-100 font-bold py-6 text-lg"
                >
                  {isProcessing ? "Processando..." : "Finalizar Compra"}
                </Button>

                <div className="bg-white/20 p-3 rounded text-sm">
                  <p className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Pagamento seguro e criptografado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
