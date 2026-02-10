import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReviewFormProps {
  onSubmit?: (rating: number, comment: string) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Por favor, selecione uma classificação");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("O comentário deve ter pelo menos 10 caracteres");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        onSubmit(rating, comment);
      }
      setRating(0);
      setComment("");
      toast.success("Avaliação enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar avaliação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 md:p-6 shadow-md border border-gray-200">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Deixe sua Avaliação</h3>

      {/* Seleção de Estrelas */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Classificação</label>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 md:w-10 md:h-10 ${
                  i < (hoveredRating || rating)
                    ? "fill-[#FF6600] text-[#FF6600]"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Você selecionou {rating} estrela{rating > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Comentário */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
          Seu Comentário
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência com a Farmácia Saude Certa..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600] text-sm md:text-base"
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500</p>
      </div>

      {/* Botão de Envio */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white font-semibold py-2 md:py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  );
}
