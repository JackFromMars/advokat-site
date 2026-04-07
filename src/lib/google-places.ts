import { readFile } from "fs/promises";
import { join } from "path";

export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  profilePhoto?: string;
}

export interface PlaceDetails {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
}

/**
 * Load reviews from static JSON file (public/data/reviews.json).
 * Scraped via: node scripts/fetch-reviews.js
 * Falls back to Google Places API if env vars configured.
 */
export async function getPlaceReviews(): Promise<PlaceDetails | null> {
  // Try local JSON first
  try {
    const filePath = join(process.cwd(), "public", "data", "reviews.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    if (data.reviews && data.reviews.length > 0) {
      return {
        rating: data.rating ?? 0,
        totalReviews: data.totalReviews ?? data.reviews.length,
        reviews: data.reviews.filter((r: GoogleReview) => r.rating >= 3),
      };
    }
  } catch {
    // fall through to API
  }

  // Fallback: Google Places API
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&language=uk&key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const result = data.result;
    if (!result) return null;

    return {
      rating: result.rating ?? 0,
      totalReviews: result.user_ratings_total ?? 0,
      reviews: (result.reviews ?? [])
        .map((r: { author_name: string; rating: number; text: string; relative_time_description: string; profile_photo_url?: string }) => ({
          authorName: r.author_name,
          rating: r.rating,
          text: r.text,
          relativeTimeDescription: r.relative_time_description,
          profilePhoto: r.profile_photo_url,
        }))
        .filter((r: GoogleReview) => r.rating >= 3),
    };
  } catch {
    return null;
  }
}
