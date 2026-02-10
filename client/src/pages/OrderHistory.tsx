import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, Calendar, DollarSign, Pill, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: orders, isLoading } = trpc.orders.getUserOrders.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id && isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">Faça login para ver seu histórico de pedidos</p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
            <p className="text-gray-600">Histórico completo de suas compras</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Package className="w-8 h-8 text-[#FF6600]" />
            </div>
            <p className="text-gray-600 mt-4">Carregando pedidos...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!orders || orders.length === 0) && (
          <Card className="border-gray-200">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600 mb-6">Você ainda não realizou nenhuma compra</p>
              <Button
                onClick={() => setLocation("/")}
                className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
              >
                Começar a Comprar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {!isLoading && orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#FF6600]">
                        R$ {parseFloat(order.totalAmount).toFixed(2)}
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {order.status === "completed"
                          ? "Entregue"
                          : order.status === "pending"
                          ? "Pendente"
                          : "Cancelado"}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Itens do Pedido:</h4>
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-2">
                        {order.items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <Pill className="w-4 h-4 text-[#00A8AF]" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.productName || `Produto #${item.productId}`}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Quantidade: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                R$ {parseFloat(item.price).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-600">
                                Subtotal: R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Sem itens registrados</p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Total do Pedido:</span>
                      </div>
                      <span className="font-bold text-lg text-[#FF6600]">
                        R$ {parseFloat(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
