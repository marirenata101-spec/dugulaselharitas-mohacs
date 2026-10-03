export async function GET(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return Response.json(
        { error: "A Supabase környezeti változói nincsenek beállítva." },
        { status: 500 }
      );
    }

    const url =
      `${supabaseUrl}/rest/v1/reviews` +
      `?approved=eq.true&order=created_at.desc`;

    const response = await fetch(url, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.message || "Supabase hiba." },
        { status: response.status }
      );
    }

    return Response.json(data);

  } catch (error) {
    return Response.json(
      { error: error.message || "Ismeretlen szerverhiba." },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.REVIEWS_NOTIFICATION_EMAIL;

    if (!supabaseUrl || !serviceKey) {
      return Response.json(
        { error: "A Supabase környezeti változói nincsenek beállítva." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const rating = Number(body.rating || 5);

    if (!name || !message) {
      return Response.json(
        { error: "A név és a vélemény megadása kötelező." },
        { status: 400 }
      );
    }

    if (name.length > 100 || message.length > 2000) {
      return Response.json(
        { error: "A megadott szöveg túl hosszú." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: "Érvénytelen értékelés." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/reviews`,
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          name,
          email: email || null,
          message,
          rating,
          approved: false
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.message || "A vélemény mentése nem sikerült." },
        { status: response.status }
      );
    }

    return Response.json(
      {
        success: true,
        message: "A vélemény sikeresen elküldve."
      },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { error: error.message || "Ismeretlen szerverhiba." },
      { status: 500 }
    );
  }
}
