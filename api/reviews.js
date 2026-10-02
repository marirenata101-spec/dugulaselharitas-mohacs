export async function GET(request) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: "GOOGLE_PLACES_API_KEY nincs beállítva a Vercelben."
        },
        { status: 500 }
      );
    }

    const placeId = "ChIJbzbjr0vRQkcRqsYWk2lP7tU";

    const url =
      `https://places.googleapis.com/v1/places/${placeId}` +
      `?languageCode=hu&fields=displayName,rating,userRatingCount,reviews` +
      `&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: data.error?.message || "Google Places API hiba"
        },
        { status: response.status }
      );
    }

    return Response.json(data);

  } catch (error) {
    return Response.json(
      {
        error: error.message || "Ismeretlen szerverhiba"
      },
      { status: 500 }
    );
  }
}
