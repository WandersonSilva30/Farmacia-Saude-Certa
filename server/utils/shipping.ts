/**
 * Cálculo de frete: R$ 5 a cada 10km
 * Distância aproximada em km entre CEPs (simplificado)
 */

export function calculateShippingCost(distanceKm: number): number {
  // R$ 5 a cada 10km
  const costPerTenKm = 5;
  const baseCost = Math.ceil(distanceKm / 10) * costPerTenKm;
  
  // Mínimo de R$ 5
  return Math.max(baseCost, 5);
}

/**
 * Estima distância entre dois CEPs (simplificado)
 * Em produção, use API de geolocalização real
 */
export function estimateDistanceBetweenZipCodes(
  zipCode1: string,
  zipCode2: string
): number {
  // Simplificação: usa os primeiros 5 dígitos para estimar distância
  // Em produção, integrar com Google Maps Distance Matrix API
  const zip1Prefix = zipCode1.substring(0, 5);
  const zip2Prefix = zipCode2.substring(0, 5);
  
  // Hash simples para gerar distância consistente
  const hash = Math.abs(
    parseInt(zip1Prefix) - parseInt(zip2Prefix)
  );
  
  // Distância estimada em km (simplificado)
  // Fórmula: cada 1000 de diferença = ~5km
  return Math.max(hash / 200, 1);
}

/**
 * Formata mensagem de confirmação para WhatsApp
 */
export function formatWhatsAppMessage(
  orderData: {
    orderId: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: Array<{
      productId: number;
      quantity: number;
      price: string;
    }>;
    subtotal: number;
    shippingCost: number;
    total: number;
    address: {
      street: string;
      number: string;
      complement?: string;
      city: string;
      state: string;
      zipCode: string;
    };
    paymentMethod: 'stripe' | 'pix';
    pixQrCode?: string;
  }
): string {
  const date = new Date().toLocaleDateString('pt-BR');
  const time = new Date().toLocaleTimeString('pt-BR');

  let message = `🎉 *Confirmação de Pedido - Farmácia Saude Certa*\n\n`;
  message += `📦 *Pedido #${orderData.orderId}*\n`;
  message += `📅 ${date} às ${time}\n\n`;

  message += `👤 *Dados do Cliente*\n`;
  message += `Nome: ${orderData.customerName}\n`;
  message += `Telefone: ${orderData.customerPhone}\n`;
  message += `Email: ${orderData.customerEmail}\n\n`;

  message += `📍 *Endereço de Entrega*\n`;
  message += `${orderData.address.street}, ${orderData.address.number}\n`;
  if (orderData.address.complement) {
    message += `${orderData.address.complement}\n`;
  }
  message += `${orderData.address.city}, ${orderData.address.state}\n`;
  message += `CEP: ${orderData.address.zipCode}\n\n`;

  message += `🛒 *Itens do Pedido*\n`;
  orderData.items.forEach((item, index) => {
    const itemTotal = parseFloat(item.price) * item.quantity;
    message += `${index + 1}. Produto #${item.productId}\n`;
    message += `   Quantidade: ${item.quantity}\n`;
    message += `   Preço: R$ ${parseFloat(item.price).toFixed(2)}\n`;
    message += `   Subtotal: R$ ${itemTotal.toFixed(2)}\n`;
  });

  message += `\n💰 *Resumo Financeiro*\n`;
  message += `Subtotal: R$ ${orderData.subtotal.toFixed(2)}\n`;
  message += `Frete: R$ ${orderData.shippingCost.toFixed(2)}\n`;
  message += `*Total: R$ ${orderData.total.toFixed(2)}*\n\n`;

  message += `💳 *Forma de Pagamento*\n`;
  if (orderData.paymentMethod === 'stripe') {
    message += `Cartão de Crédito (Stripe)\n`;
    message += `Status: Aguardando confirmação\n`;
  } else if (orderData.paymentMethod === 'pix') {
    message += `PIX\n`;
    if (orderData.pixQrCode) {
      message += `QR Code: ${orderData.pixQrCode}\n`;
    }
    message += `Status: Aguardando pagamento\n`;
  }

  message += `\n✅ Seu pedido foi registrado com sucesso!\n`;
  message += `Você receberá uma atualização assim que o pagamento for confirmado.\n\n`;
  message += `📞 Dúvidas? Entre em contato conosco!\n`;
  message += `Telefone: (81) 93816-0087\n`;
  message += `Email: erikabarbosaadelinodeoliveira@gmail.com\n\n`;
  message += `Obrigado por escolher a Farmácia Saude Certa! 💚🧡`;

  return message;
}

/**
 * Gera link de WhatsApp para enviar mensagem
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  // Remove caracteres especiais do telefone
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Adiciona código do Brasil se não tiver
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  // Codifica a mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${fullPhone}?text=${encodedMessage}`;
}

/**
 * Formata telefone para padrão brasileiro
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  
  return phone;
}
