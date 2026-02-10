import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Trash2, Plus, Edit2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"products" | "promotions" | "inventory" | "reports">("products");
  const [showProductForm, setShowProductForm] = useState(false);

  const { data: products, refetch: refetchProducts } = trpc.products.list.useQuery();
  const { data: categories } = trpc.products.categories.useQuery();
  const createProduct = trpc.products.create.useMutation();
  const deleteProduct = trpc.products.delete.useMutation();
  const updateInventory = trpc.inventory.update.useMutation();
  const createPromotion = trpc.promotions.create.useMutation();
  const deletePromotion = trpc.promotions.delete.useMutation();

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    categoryId: 1,
    price: "",
    image: "",
    quantity: "",
  });

  const [promotionForm, setPromotionForm] = useState({
    productId: 1,
    discountPercent: "",
    startDate: "",
    endDate: "",
  });

  const [inventoryForm, setInventoryForm] = useState({
    productId: 1,
    quantity: "",
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página</p>
          <Button onClick={() => setLocation("/")} className="bg-[#FF6600]">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  const handleAddProduct = async () => {
    try {
      await createProduct.mutateAsync({
        ...productForm,
        categoryId: parseInt(productForm.categoryId.toString()),
        quantity: productForm.quantity ? parseInt(productForm.quantity) : 0,
      });
      setProductForm({
        name: "",
        description: "",
        categoryId: 1,
        price: "",
        image: "",
        quantity: "",
      });
      setShowProductForm(false);
      refetchProducts();
    } catch (error) {
      alert("Erro ao adicionar produto: " + (error as any).message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await deleteProduct.mutateAsync({ id });
        refetchProducts();
      } catch (error) {
        alert("Erro ao deletar produto");
      }
    }
  };

  const handleUpdateInventory = async () => {
    try {
      await updateInventory.mutateAsync({
        productId: parseInt(inventoryForm.productId.toString()),
        quantity: parseInt(inventoryForm.quantity),
      });
      alert("Estoque atualizado com sucesso!");
      setInventoryForm({ productId: 1, quantity: "" });
    } catch (error) {
      alert("Erro ao atualizar estoque");
    }
  };

  const handleAddPromotion = async () => {
    try {
      await createPromotion.mutateAsync({
        productId: parseInt(promotionForm.productId.toString()),
        discountPercent: promotionForm.discountPercent,
        startDate: promotionForm.startDate,
        endDate: promotionForm.endDate,
      });
      setPromotionForm({
        productId: 1,
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      alert("Promoção adicionada com sucesso!");
    } catch (error) {
      alert("Erro ao adicionar promoção");
    }
  };

  // Dados de exemplo para gráficos
  const chartData = [
    { date: "01", sales: 1200, orders: 4 },
    { date: "02", sales: 1900, orders: 3 },
    { date: "03", sales: 1500, orders: 2 },
    { date: "04", sales: 2200, orders: 5 },
    { date: "05", sales: 2800, orders: 6 },
    { date: "06", sales: 2390, orders: 3 },
    { date: "07", sales: 2490, orders: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo - Farmácia Saude Certa</h1>
        </div>

        {/* Abas de Navegação */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["products", "inventory", "promotions", "reports"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              variant={activeTab === tab ? "default" : "outline"}
              className={activeTab === tab ? "bg-[#FF6600] hover:bg-[#E55A00]" : ""}
            >
              {tab === "products" && "Produtos"}
              {tab === "inventory" && "Estoque"}
              {tab === "promotions" && "Promoções"}
              {tab === "reports" && "Relatórios"}
            </Button>
          ))}
        </div>

        {/* Produtos */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
              <Button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-[#FF6600] hover:bg-[#E55A00]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            {showProductForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Adicionar Novo Produto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Nome do Produto"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Preço"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({ ...productForm, price: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Descrição"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Quantidade Inicial"
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) =>
                        setProductForm({ ...productForm, quantity: e.target.value })
                      }
                    />
                    <Input
                      placeholder="URL da Imagem"
                      value={productForm.image}
                      onChange={(e) =>
                        setProductForm({ ...productForm, image: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleAddProduct}
                    disabled={createProduct.isPending}
                    className="bg-[#00A8AF] hover:bg-[#0096A3]"
                  >
                    {createProduct.isPending ? "Salvando..." : "Salvar Produto"}
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: any) => (
                <Card key={product.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-xl font-bold text-[#FF6600] mb-4">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Estoque */}
        {activeTab === "inventory" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Controle de Estoque</h2>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Atualizar Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <select
                    value={inventoryForm.productId}
                    onChange={(e) =>
                      setInventoryForm({
                        ...inventoryForm,
                        productId: parseInt(e.target.value),
                      })
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    {products?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Quantidade"
                    type="number"
                    value={inventoryForm.quantity}
                    onChange={(e) =>
                      setInventoryForm({
                        ...inventoryForm,
                        quantity: e.target.value,
                      })
                    }
                  />
                  <Button
                    onClick={handleUpdateInventory}
                    disabled={updateInventory.isPending}
                    className="bg-[#00A8AF] hover:bg-[#0096A3]"
                  >
                    {updateInventory.isPending ? "Atualizando..." : "Atualizar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Promoções */}
        {activeTab === "promotions" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Gerenciar Promoções</h2>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Adicionar Promoção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <select
                    value={promotionForm.productId}
                    onChange={(e) =>
                      setPromotionForm({
                        ...promotionForm,
                        productId: parseInt(e.target.value),
                      })
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    {products?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Desconto %"
                    type="number"
                    value={promotionForm.discountPercent}
                    onChange={(e) =>
                      setPromotionForm({
                        ...promotionForm,
                        discountPercent: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Data Início"
                    type="date"
                    value={promotionForm.startDate}
                    onChange={(e) =>
                      setPromotionForm({
                        ...promotionForm,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Data Fim"
                    type="date"
                    value={promotionForm.endDate}
                    onChange={(e) =>
                      setPromotionForm({
                        ...promotionForm,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleAddPromotion}
                  disabled={createPromotion.isPending}
                  className="bg-[#FF6600] hover:bg-[#E55A00]"
                >
                  {createPromotion.isPending ? "Salvando..." : "Adicionar Promoção"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Relatórios */}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Relatórios de Vendas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas Diárias</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#FF6600" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pedidos Diários</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="orders" stroke="#00A8AF" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
