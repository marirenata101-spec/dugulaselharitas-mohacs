function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


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

    // E-mail értesítés az új véleményről
    let notificationSent = false;

    if (resendApiKey && notificationEmail) {
      try {
        const stars =
          "★".repeat(rating) + "☆".repeat(5 - rating);

        const adminUrl =
          "https://dugulaselharitas-mohacs.hu/admin-velemenyek.html";

        const emailResponse = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: "Duguláselhárítás vélemények <onboarding@resend.dev>",
              to: [notificationEmail],
              subject:
                "Új vélemény érkezett – jóváhagyás szükséges",

              html: `
                <h2>Új vélemény érkezett</h2>

                <p>
                  <strong>Név:</strong>
                  ${escapeHtml(name)}
                </p>

                <p>
                  <strong>Értékelés:</strong>
                  ${stars}
                </p>

                <p>
                  <strong>Vélemény:</strong><br>
                  ${escapeHtml(message).replaceAll("\n", "<br>")}
                </p>

                <p>
                  <a href="${adminUrl}">
                    Vélemény jóváhagyása vagy elutasítása
                  </a>
                </p>
              `,

              text:
                `Új vélemény érkezett\n\n` +
                `Név: ${name}\n` +
                `Értékelés: ${stars}\n` +
                `Vélemény: ${message}\n\n` +
                `Jóváhagyás vagy elutasítás:\n${adminUrl}`
            })
          }
        );

        notificationSent = emailResponse.ok;

        if (!emailResponse.ok) {
          console.error(
            "Resend hiba:",
            await emailResponse.text()
          );
        }

      } catch (emailError) {
        console.error(
          "E-mail értesítési hiba:",
          emailError
        );
      }

    } else {
      console.error(
        "Hiányzó Resend értesítési környezeti változó."
      );
    }

    return Response.json(
      {
        success: true,
        message: "A vélemény sikeresen elküldve.",
        notificationSent
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
