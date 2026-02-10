import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = "558193816087",
  message = "Olá! Gostaria de saber mais sobre os produtos e serviços da Farmácia Saude Certa.",
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      title="Enviar mensagem no WhatsApp"
      aria-label="Enviar mensagem no WhatsApp"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
    </a>
  );
}
