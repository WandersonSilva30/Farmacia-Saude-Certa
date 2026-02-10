import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, QrCode } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CheckoutOptionsProps {
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingCost: number;
  addressId: number;
  customerPhone: string;
}

export function CheckoutOptions({
  items,
  total,
  shippingCost,
  addressId,
  customerPhone,
}: CheckoutOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "pix">("stripe");
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();
  const createPixPayment = trpc.payments.createPixPayment.useMutation();

  const handleStripeCheckout = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        addressId,
      });

      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Redirecionando para Stripe...");
      }
    } catch (error) {
      toast.error("Erro ao processar pagamento com cartão");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePixPayment = async () => {
    setIsLoading(true);
    try {
      const result = await createPixPayment.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        addressId,
        shippingCost,
        customerPhone,
      });

      if (result.pixQrCode) {
        // Mostrar QR Code do PIX
        toast.success("QR Code PIX gerado! Escaneie para pagar.");
        // Aqui você poderia abrir um modal com o QR Code
      }
    } catch (error) {
      toast.error("Erro ao gerar PIX");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Escolha a Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Opção Cartão */}
          <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#FF6600] transition" style={{borderColor: paymentMethod === "stripe" ? "#FF6600" : "#E5E7EB"}}>
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-[#FF6600]" />
                <h3 className="font-semibold text-gray-900">Cartão de Crédito</h3>
              </div>
              <p className="text-sm text-gray-600">Pague com segurança via Stripe</p>
            </div>
          </label>

          {/* Opção PIX */}
          <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#00A8AF] transition" style={{borderColor: paymentMethod === "pix" ? "#00A8AF" : "#E5E7EB"}}>
            <input
              type="radio"
              name="payment"
              value="pix"
              checked={paymentMethod === "pix"}
              onChange={() => setPaymentMethod("pix")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="w-5 h-5 text-[#00A8AF]" />
                <h3 className="font-semibold text-gray-900">PIX</h3>
              </div>
              <p className="text-sm text-gray-600">Escaneie o QR Code para pagar instantaneamente</p>
            </div>
          </label>

          {/* Resumo */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">R$ {(total - shippingCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frete:</span>
              <span className="font-medium">R$ {shippingCost.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-[#FF6600]">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botão de Pagamento */}
          <Button
            onClick={paymentMethod === "stripe" ? handleStripeCheckout : handlePixPayment}
            disabled={isLoading}
            className={`w-full py-6 font-semibold text-white ${
              paymentMethod === "stripe"
                ? "bg-[#FF6600] hover:bg-[#E55A00]"
                : "bg-[#00A8AF] hover:bg-[#0096A3]"
            }`}
          >
            {isLoading
              ? "Processando..."
              : paymentMethod === "stripe"
              ? "Pagar com Cartão"
              : "Gerar QR Code PIX"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
