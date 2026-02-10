import { Star } from "lucide-react";

interface ReviewCardProps {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewCard({ author, rating, comment, date }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm md:text-base">{author}</h4>
          <p className="text-gray-500 text-xs md:text-sm">{date}</p>
        </div>
      </div>

      {/* Estrelas */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 md:w-5 md:h-5 ${
              i < rating
                ? "fill-[#FF6600] text-[#FF6600]"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">{rating}.0</span>
      </div>

      {/* Comentário */}
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{comment}</p>
    </div>
  );
}
