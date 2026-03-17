import { Phone, Wrench, Droplet, Camera } from "lucide-react";
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.18),rgba(16,185,129,0.28))] rounded-3xl">
        <h2 className="text-3xl font-bold">Szolgáltatások</h2>
        <p className="mt-4 max-w-3xl text-slate-700 leading-8">
          Szolgáltatásainkat Mohácson és 45 km-es körzetében vállaljuk. A kapcsolatfelvétel 0–24 órában lehetséges, a kiszállás pedig jellemzően 48 órán belül történik.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {services.map((s) => (
            <div key={s.title} className="p-6 rounded-xl bg-white/80 backdrop-blur border border-emerald-100 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/90">
              <div className="text-emerald-600 mb-3">{s.icon}</div>
              <h3 className="font-semibold text-xl">{s.title}</h3>
              <p className="mt-3 text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold">Ügyfélvélemények</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {reviews.map((r, i) => (
            <div key={i} className="border p-6 rounded-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg bg-white">
              <div>★★★★★</div>
              <p className="mt-4">“{r.text}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEW FORM */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Írj véleményt</h2>

          <p className="mt-4 text-slate-600">
            Oszd meg tapasztalatodat szolgáltatásunkkal kapcsolatban.
          </p>

          <form className="mt-8 grid gap-4">
            <input type="text" placeholder="Név (nem kötelező)" className="p-3 border rounded-lg" />
            <textarea placeholder="Véleményed" className="p-3 border rounded-lg h-32" />
            <button className="bg-emerald-500 px-6 py-3 rounded-xl font-semibold transition duration-300 hover:scale-[1.02] hover:shadow-lg">
              Vélemény küldése
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-500">
            Köszönjük visszajelzésedet.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Kapcsolat</h2>

          <div className="mt-6">
            📞 +36 30 790 3748<br />
            📞 +36 20 772 0584<br />
            ✉ folbertzsolt@gmail.com
          </div>

          <div className="mt-6">
            <a href="https://www.facebook.com/61584897203579" className="underline">Facebook</a><br />
            <a href="https://www.google.com/search?q=Moh%C3%A0cs+%C3%89s+K%C3%B6rny%C3%A9ke+Dugul%C3%A0selh%C3%A0r%C3%ADt%C3%A0s" className="underline">Google</a>
          </div>
        </div>
      </section>

    </div>
  );
}
