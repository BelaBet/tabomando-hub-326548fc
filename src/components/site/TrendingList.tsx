import { Flame } from "lucide-react";
import { taBombando } from "@/lib/demo-data";

export function TrendingList() {
  return (
    <section aria-labelledby="ta-bombando" className="rounded-xl border border-border bg-surface p-5">
      <header className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Flame size={16} />
        </span>
        <h2 id="ta-bombando" className="font-display text-xl font-black">Tá Bombando</h2>
      </header>
      <ul className="mt-4 flex flex-wrap gap-2">
        {taBombando.map((t, i) => (
          <li key={t}>
            <a
              href={`/busca?q=${encodeURIComponent(t)}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-sm font-semibold text-ink hover:border-primary hover:text-primary transition"
            >
              <span className="text-primary font-black">#{i + 1}</span>
              {t}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
