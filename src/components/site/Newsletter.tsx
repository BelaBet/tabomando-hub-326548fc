export function Newsletter() {
  return (
    <section id="newsletter" className="relative overflow-hidden rounded-xl bg-brand-black text-white p-8 md:p-12">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30" style={{ background: "var(--gradient-red)" }} />
      <div className="relative max-w-2xl">
        <span className="highlight-chip">Newsletter</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-black leading-tight">
          Receba a fofoca antes que ela esfrie
        </h2>
        <p className="mt-2 text-white/75">
          Um resumo diário no seu e-mail: manchetes, bastidores e curiosidades verificadas.
        </p>
        <form
          className="mt-5 flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Cadastro de demonstração — sem envio real.");
          }}
        >
          <label className="sr-only" htmlFor="nl-email">E-mail</label>
          <input
            id="nl-email"
            type="email"
            required
            placeholder="seu@email.com"
            className="flex-1 rounded-md bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            Quero receber
          </button>
        </form>
        <label className="mt-3 flex items-start gap-2 text-xs text-white/60">
          <input type="checkbox" required className="mt-0.5" />
          Concordo em receber e-mails e li a Política de Privacidade.
        </label>
      </div>
    </section>
  );
}
