export default async function handler(req, res) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GOOGLE_PLACES_API_KEY nincs beállítva a Vercelben."
      });
    }

    const placeId = "ChIJbzbjr0vRQkcRqsYWk2lP7tU";

    const url =
      `https://places.googleapis.com/v1/places/${placeId}` +
      `?languageCode=hu&fields=displayName,rating,userRatingCount,reviews,googleMapsLinks` +
      `&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Google Places API hiba"
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Ismeretlen szerverhiba"
    });
  }
}
