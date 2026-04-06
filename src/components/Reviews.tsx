import { contacts } from "@/data/contacts";
import type { PlaceDetails } from "@/lib/google-places";

interface ReviewsProps {
  data: PlaceDetails | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-amber-400" : "text-slate-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews({ data }: ReviewsProps) {
  if (!data || data.reviews.length === 0) {
    return (
      <section id="reviews" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="gold-gradient">Відгуки</span> клієнтів
          </h2>
          <p className="text-slate-400 mb-6">
            Подивіться, що кажуть клієнти про мою роботу
          </p>
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover text-amber-400 font-medium rounded-xl"
          >
            Читати відгуки в Google →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="gold-gradient">Відгуки</span> клієнтів
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Stars rating={Math.round(data.rating)} />
            <span className="text-white font-semibold">{data.rating}</span>
            <span className="text-slate-400">
              ({data.totalReviews} відгуків у Google)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.reviews.slice(0, 6).map((review, index) => (
            <div key={index} className="glass p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {review.authorName}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {review.relativeTimeDescription}
                  </p>
                </div>
              </div>
              <Stars rating={review.rating} />
              <p className="text-slate-300 text-sm leading-relaxed mt-3 line-clamp-4">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover text-amber-400 font-medium rounded-xl"
          >
            Усі відгуки в Google →
          </a>
        </div>
      </div>
    </section>
  );
}
