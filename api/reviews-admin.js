export async function GET(request) {
  try {
    const adminPassword = process.env.REVIEWS_ADMIN_PASSWORD;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const password = request.headers.get("x-admin-password");

    if (!adminPassword || !supabaseUrl || !serviceKey) {
      return Response.json(
        { error: "Hiányzó környezeti változó." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return Response.json(
        { error: "Hibás jelszó." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/reviews?order=created_at.desc`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`
        }
      }
    );

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
      { error: error.message || "Szerverhiba." },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  try {
    const adminPassword = process.env.REVIEWS_ADMIN_PASSWORD;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const password = request.headers.get("x-admin-password");

    if (!adminPassword || !supabaseUrl || !serviceKey) {
      return Response.json(
        { error: "Hiányzó környezeti változó." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return Response.json(
        { error: "Hibás jelszó." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);
    const approved = Boolean(body.approved);

    if (!id) {
      return Response.json(
        { error: "Hiányzó véleményazonosító." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/reviews?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          approved
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.message || "A módosítás nem sikerült." },
        { status: response.status }
      );
    }

    return Response.json({
      success: true,
      review: data[0] || null
    });

  } catch (error) {
    return Response.json(
      { error: error.message || "Szerverhiba." },
      { status: 500 }
    );
  }
}
