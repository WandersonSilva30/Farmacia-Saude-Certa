import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StripeCheckoutProps {
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  total: number;
  addressId: number;
}

export function StripeCheckout({ items, total, addressId }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  const handleCheckout = async () => {
    if (!addressId) {
      toast.error("Por favor, selecione um endereço de entrega");
      return;
    }

    if (items.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createCheckoutSession.mutateAsync({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        addressId,
      });

      if (result.checkoutUrl) {
        toast.success("Redirecionando para pagamento...");
        window.open(result.checkoutUrl, "_blank");
      } else {
        toast.error("Erro ao criar sessão de checkout");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#FF6600]" />
          Resumo do Pedido
        </CardTitle>
        <CardDescription>Revise os detalhes antes de pagar</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items Summary */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Itens:</h4>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-600">
              <span>Produto #{item.productId} x {item.quantity}</span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-[#FF6600]">R$ {total.toFixed(2)}</span>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-semibold mb-1">💳 Pagamento Seguro</p>
          <p>Você será redirecionado para o Stripe para completar o pagamento com segurança.</p>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isLoading || items.length === 0}
          className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white h-12 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar com Cartão
            </>
          )}
        </Button>

        {/* Test Card Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <p className="font-semibold mb-1">🧪 Modo de Teste</p>
          <p>Use o cartão: <strong>4242 4242 4242 4242</strong></p>
          <p>Data: qualquer data futura | CVC: qualquer 3 dígitos</p>
        </div>
      </CardContent>
    </Card>
  );
}
