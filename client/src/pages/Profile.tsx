import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const { data: addresses, refetch: refetchAddresses } = trpc.addresses.list.useQuery(undefined as any);
  const { data: phones, refetch: refetchPhones } = trpc.phones.list.useQuery(undefined as any);

  const createAddress = trpc.addresses.create.useMutation();
  const deleteAddress = trpc.addresses.delete.useMutation();
  const createPhone = trpc.phones.create.useMutation();
  const deletePhone = trpc.phones.delete.useMutation();

  const [addressForm, setAddressForm] = useState({
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [phoneForm, setPhoneForm] = useState({
    phone: "",
  });

  const handleAddAddress = async () => {
    try {
      await createAddress.mutateAsync(addressForm);
      setAddressForm({ street: "", number: "", complement: "", city: "", state: "", zipCode: "" });
      setShowAddressForm(false);
      refetchAddresses();
    } catch (error) {
      alert("Erro ao adicionar endereço");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteAddress.mutateAsync({ id });
      refetchAddresses();
    } catch (error) {
      alert("Erro ao deletar endereço");
    }
  };

  const handleAddPhone = async () => {
    try {
      await createPhone.mutateAsync(phoneForm);
      setPhoneForm({ phone: "" });
      setShowPhoneForm(false);
      refetchPhones();
    } catch (error) {
      alert("Erro ao adicionar telefone");
    }
  };

  const handleDeletePhone = async (id: number) => {
    try {
      await deletePhone.mutateAsync({ id });
      refetchPhones();
    } catch (error) {
      alert("Erro ao deletar telefone");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Você precisa fazer login</h1>
          <Button onClick={() => setLocation("/")} className="bg-[hsl(120,60%,40%)]">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil - Farmácia Saude Certa</h1>
        </div>

        {/* Informações do Usuário */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Nome</label>
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Email</label>
                <p className="text-lg">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereços */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Endereços</CardTitle>
              <Button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="bg-[#FF6600] hover:bg-[#E55A00]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Endereço
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddressForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Rua"
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Número"
                    value={addressForm.number}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, number: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Complemento"
                    value={addressForm.complement}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, complement: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Cidade"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Estado"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                  />
                  <Input
                    placeholder="CEP"
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, zipCode: e.target.value })
                    }
                  />
                </div>
                <Button
                  onClick={handleAddAddress}
                  disabled={createAddress.isPending}
                    className="bg-[#00A8AF] hover:bg-[#0096A3]"
              >
                {createAddress.isPending ? "Salvando..." : "Salvar Endereço"}
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {addresses && addresses.length > 0 ? (
                addresses.map((addr: any) => (
                  <div key={addr.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{addr.street}, {addr.number}</p>
                        <p className="text-sm text-gray-600">{addr.complement}</p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.state} - {addr.zipCode}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Nenhum endereço cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Telefones */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Telefones</CardTitle>
              <Button
                onClick={() => setShowPhoneForm(!showPhoneForm)}
                className="bg-[#FF6600] hover:bg-[#E55A00]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Telefone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showPhoneForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex gap-4 mb-4">
                  <Input
                    placeholder="Telefone"
                    value={phoneForm.phone}
                    onChange={(e) =>
                      setPhoneForm({ ...phoneForm, phone: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
                <Button
                  onClick={handleAddPhone}
                  disabled={createPhone.isPending}
                  className="bg-[#00A8AF] hover:bg-[#0096A3]"
                >
                  {createPhone.isPending ? "Salvando..." : "Salvar Telefone"}
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {phones && phones.length > 0 ? (
                phones.map((phone: any) => (
                  <div key={phone.id} className="border p-4 rounded-lg flex justify-between items-center">
                    <p className="font-semibold">{phone.phone}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePhone(phone.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Nenhum telefone cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
