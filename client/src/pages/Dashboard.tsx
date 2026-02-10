import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, Package, ShoppingCart, DollarSign, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Dados de exemplo para demonstração
  const dailyData = [
    { date: "01", sales: 1200, orders: 4, revenue: 4800 },
    { date: "02", sales: 1900, orders: 3, revenue: 5700 },
    { date: "03", sales: 1500, orders: 2, revenue: 3000 },
    { date: "04", sales: 2200, orders: 5, revenue: 11000 },
    { date: "05", sales: 2800, orders: 6, revenue: 16800 },
    { date: "06", sales: 2390, orders: 3, revenue: 7170 },
    { date: "07", sales: 2490, orders: 4, revenue: 9960 },
  ];

  const categoryData = [
    { name: "Medicamentos", value: 35, color: "#FF6600" },
    { name: "Higiene", value: 25, color: "#00A8AF" },
    { name: "Saúde", value: 20, color: "#FF8C00" },
    { name: "Bem-estar", value: 20, color: "#00B8C4" },
  ];

  const monthlyData = [
    { month: "Jan", sales: 15000, orders: 45 },
    { month: "Fev", sales: 18000, orders: 52 },
    { month: "Mar", sales: 16500, orders: 48 },
    { month: "Abr", sales: 22000, orders: 65 },
    { month: "Mai", sales: 25000, orders: 72 },
    { month: "Jun", sales: 23000, orders: 68 },
  ];

  const topProducts = [
    { name: "Dipirona 500mg", sales: 245, revenue: 1470 },
    { name: "Vitamina C 1000mg", sales: 189, revenue: 1701 },
    { name: "Protetor Solar SPF 50", sales: 156, revenue: 2340 },
    { name: "Antiacido", sales: 134, revenue: 804 },
    { name: "Xarope para Tosse", sales: 98, revenue: 686 },
  ];

  const handleExportData = () => {
    const data = {
      period: selectedMonth,
      dailyData,
      monthlyData,
      topProducts,
      categoryDistribution: categoryData,
      generatedAt: new Date().toISOString(),
    };

    const csv = convertToCSV(data);
    downloadCSV(csv, `relatorio-farmacia-${selectedMonth}.csv`);
  };

  const convertToCSV = (data: any) => {
    let csv = "Relatório de Vendas - Farmácia Laranja & Verde\n";
    csv += `Período: ${selectedMonth}\n`;
    csv += `Gerado em: ${new Date().toLocaleString("pt-BR")}\n\n`;

    csv += "=== VENDAS DIÁRIAS ===\n";
    csv += "Data,Quantidade Vendida,Pedidos,Receita\n";
    data.dailyData.forEach((d: any) => {
      csv += `${d.date},${d.sales},${d.orders},R$ ${d.revenue.toFixed(2)}\n`;
    });

    csv += "\n=== VENDAS MENSAIS ===\n";
    csv += "Mês,Vendas,Pedidos\n";
    data.monthlyData.forEach((m: any) => {
      csv += `${m.month},R$ ${m.sales.toFixed(2)},${m.orders}\n`;
    });

    csv += "\n=== PRODUTOS MAIS VENDIDOS ===\n";
    csv += "Produto,Quantidade,Receita\n";
    data.topProducts.forEach((p: any) => {
      csv += `${p.name},${p.sales},R$ ${p.revenue.toFixed(2)}\n`;
    });

    csv += "\n=== DISTRIBUIÇÃO POR CATEGORIA ===\n";
    csv += "Categoria,Percentual\n";
    data.categoryDistribution.forEach((c: any) => {
      csv += `${c.name},${c.value}%\n`;
    });

    return csv;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalRevenue = dailyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = dailyData.reduce((sum, d) => sum + d.orders, 0);
  const averageOrderValue = totalRevenue / totalOrders;

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Vendas - Farmácia Saude Certa</h1>
          <Button
            onClick={handleExportData}
            className="ml-auto bg-[#FF6600] hover:bg-[#E55A00]"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-[#FF6600]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Período selecionado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total de Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#00A8AF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
              <p className="text-xs text-gray-500">Pedidos processados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#FF6600]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">R$ {averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Valor médio por pedido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Produtos Ativos</CardTitle>
              <Package className="h-4 w-4 text-[#00A8AF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">127</div>
              <p className="text-xs text-gray-500">Produtos no catálogo</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vendas Diárias */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#FF6600" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Receita Diária */}
          <Card>
            <CardHeader>
              <CardTitle>Receita Diária</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `R$ ${(value as number).toFixed(2)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00A8AF"
                    name="Receita (R$)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vendas Mensais */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Vendas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `R$ ${(value as number).toFixed(2)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#FF6600"
                    name="Vendas (R$)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Produtos Mais Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Produto</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-900">Quantidade</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-900">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-700">{product.name}</td>
                      <td className="text-right py-2 px-4 text-gray-700">{product.sales}</td>
                      <td className="text-right py-2 px-4 font-semibold text-[#FF6600]">
                        R$ {product.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé com informações */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Benefícios desta página:</strong> Você pode explorar os dados de forma mais
            intuitiva através dos gráficos interativos, compreender melhor as tendências de vendas
            ao longo do tempo, e salvar ou compartilhar facilmente os relatórios em formato CSV
            para análise posterior.
          </p>
        </div>
      </div>
    </div>
  );
}
