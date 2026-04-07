export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
}

export interface PlaceDetails {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
}

export async function getPlaceReviews(): Promise<PlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return null;
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&language=uk&key=${apiKey}`,
      { next: { revalidate: 86400 } } // 24 hours
    );

    if (!res.ok) return null;

    const data = await res.json();
    const result = data.result;

    if (!result) return null;

    return {
      rating: result.rating ?? 0,
      totalReviews: result.user_ratings_total ?? 0,
      reviews: (result.reviews ?? [])
        .map(
          (r: { author_name: string; rating: number; text: string; relative_time_description: string }) => ({
            authorName: r.author_name,
            rating: r.rating,
            text: r.text,
            relativeTimeDescription: r.relative_time_description,
          })
        )
        .filter((r: GoogleReview) => r.rating >= 3),
    };
  } catch {
    return null;
  }
}
