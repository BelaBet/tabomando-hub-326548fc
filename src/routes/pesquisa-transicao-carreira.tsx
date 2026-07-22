import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, LockKeyhole } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/pesquisa-transicao-carreira")({
  head: () => ({
    meta: [
      { title: "Pesquisa sobre transição de carreira | Tá Sabendo?" },
      {
        name: "description",
        content:
          "Conte quais são suas principais dúvidas e dificuldades ao pensar em uma mudança de carreira.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Qual é a parte mais difícil de mudar de carreira?" },
    ],
    links: [{ rel: "canonical", href: "/pesquisa-transicao-carreira" }],
  }),
  component: PesquisaTransicaoCarreira,
});

const situacoes = [
  "Estou satisfeito com minha carreira",
  "Penso em mudar, mas ainda tenho dúvidas",
  "Estou pesquisando novas carreiras",
  "Já estou me preparando para mudar",
  "Estou desempregado e buscando uma direção",
  "Já mudei de carreira recentemente",
  "Outro",
];

const dificuldades = [
  "Não sei qual carreira escolher",
  "Tenho medo de perder renda",
  "Não tenho experiência na nova área",
  "Não sei por onde começar",
  "Não tenho tempo para me preparar",
  "Tenho medo de me arrepender",
  "Sinto pressão da família",
  "Outro",
];

const tiposAjuda = [
  "Descobrir carreiras compatíveis com meu perfil",
  "Comparar diferentes possibilidades",
  "Conhecer salários e oportunidades",
  "Identificar habilidades que preciso desenvolver",
  "Simular como seria minha rotina na nova carreira",
  "Criar um plano de transição",
  "Conversar com alguém da área",
  "Outro",
];

function OptionButton({
  label,
  selected,
  multiple = false,
  onClick,
}: {
  label: string;
  selected: boolean;
  multiple?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 ${
        selected
          ? "border-violet-600 bg-violet-50 text-violet-950 shadow-sm"
          : "border-border bg-white text-ink"
      }`}
    >
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center border text-[11px] transition ${
          multiple ? "rounded" : "rounded-full"
        } ${selected ? "border-violet-600 bg-violet-600 text-white" : "border-zinc-300 bg-white"}`}
      >
        {selected ? <Check size={13} strokeWidth={3} /> : null}
      </span>
      {label}
    </button>
  );
}

function PesquisaTransicaoCarreira() {
  const [step, setStep] = useState(1);
  const [situacao, setSituacao] = useState("");
  const [dificuldade, setDificuldade] = useState("");
  const [ajudas, setAjudas] = useState<string[]>([]);
  const [relato, setRelato] = useState("");
  const [email, setEmail] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const progress = useMemo(() => Math.min(step, 4) * 25, [step]);
  const canContinue =
    (step === 1 && Boolean(situacao)) ||
    (step === 2 && Boolean(dificuldade)) ||
    (step === 3 && ajudas.length > 0) ||
    step === 4;

  function toggleAjuda(item: string) {
    setAjudas((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  async function finishSurvey() {
    setSubmitting(true);
    setError("");

    const { error: insertError } = await supabase.from("pesquisa_transicao_carreira").insert({
      situacao_profissional: situacao,
      maior_dificuldade: dificuldade,
      tipos_ajuda: ajudas,
      relato: relato.trim() || null,
      email: email.trim() || null,
      consentimento_uso_anonimo: consentimento,
      pagina_origem: typeof window !== "undefined" ? window.location.pathname : null,
    });

    setSubmitting(false);
    if (insertError) {
      console.error("Erro ao salvar pesquisa:", insertError);
      setError("Não conseguimos enviar sua resposta agora. Tente novamente em alguns instantes.");
      return;
    }

    setStep(5);
  }

  function restart() {
    setStep(1);
    setSituacao("");
    setDificuldade("");
    setAjudas([]);
    setRelato("");
    setEmail("");
    setConsentimento(false);
    setError("");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-editorial py-8 md:py-12">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_28px_80px_rgba(48,35,92,0.12)] lg:grid lg:min-h-[720px] lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="relative overflow-hidden bg-gradient-to-br from-violet-800 via-violet-600 to-fuchsia-500 p-8 text-white md:p-12 lg:flex lg:flex-col lg:justify-between lg:p-14">
            <div className="relative z-10">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-100">
                Sua experiência importa
              </span>
              <h1 className="mt-6 max-w-lg font-sans text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl">
                Vamos entender o que realmente pesa em uma mudança de carreira.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/80">
                São quatro perguntas rápidas. Suas respostas ajudam a construir conteúdos mais
                próximos da vida real.
              </p>
            </div>

            <div className="relative z-10 mt-10 hidden items-center gap-3 border-t border-white/20 pt-8 lg:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-violet-700">
                <LockKeyhole size={18} />
              </span>
              <div>
                <strong className="text-sm">Resposta protegida</strong>
                <p className="mt-1 text-xs text-white/70">Você escolhe se quer deixar seu e-mail.</p>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full border-[44px] border-white/10" />
          </aside>

          <section className="flex min-h-[680px] flex-col p-6 md:p-10 lg:p-14">
            {step <= 4 ? (
              <>
                <div>
                  <div className="mb-2 flex justify-between text-[11px] font-black uppercase tracking-widest text-ink-soft">
                    <span>Etapa {step} de 4</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-700 to-violet-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <span className="text-xs font-black tracking-widest text-orange-500">0{step}</span>

                  {step === 1 && (
                    <Question title="Em qual momento profissional você está?" help="Escolha a opção que mais combina com você hoje.">
                      {situacoes.map((item) => (
                        <OptionButton key={item} label={item} selected={situacao === item} onClick={() => setSituacao(item)} />
                      ))}
                    </Question>
                  )}

                  {step === 2 && (
                    <Question title="Qual é sua maior dificuldade para mudar de carreira?" help="Escolha apenas a dificuldade principal.">
                      {dificuldades.map((item) => (
                        <OptionButton key={item} label={item} selected={dificuldade === item} onClick={() => setDificuldade(item)} />
                      ))}
                    </Question>
                  )}

                  {step === 3 && (
                    <Question title="Que tipo de ajuda faria mais diferença para você?" help="Você pode selecionar mais de uma opção.">
                      {tiposAjuda.map((item) => (
                        <OptionButton key={item} label={item} selected={ajudas.includes(item)} multiple onClick={() => toggleAjuda(item)} />
                      ))}
                    </Question>
                  )}

                  {step === 4 && (
                    <div>
                      <h2 className="mt-3 max-w-2xl font-sans text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink">
                        O que ninguém parece compreender sobre sua situação profissional?
                      </h2>
                      <p className="mt-2 text-sm text-ink-soft">Esta pergunta é opcional. Escreva do seu jeito.</p>

                      <label className="mt-7 block text-xs font-bold text-ink" htmlFor="relato">Sua experiência</label>
                      <textarea
                        id="relato"
                        value={relato}
                        maxLength={600}
                        onChange={(event) => setRelato(event.target.value)}
                        placeholder="Conte o que você tem vivido, pensado ou sentido sobre sua carreira..."
                        className="mt-2 min-h-32 w-full resize-y rounded-xl border border-border bg-white p-4 text-sm outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
                      />
                      <div className="mt-1 text-right text-[10px] text-ink-soft">{relato.length}/600</div>

                      <label className="mt-3 block text-xs font-bold text-ink" htmlFor="email">
                        E-mail <span className="font-normal text-ink-soft">opcional</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="voce@exemplo.com"
                        className="mt-2 h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
                      />

                      <button
                        type="button"
                        aria-pressed={consentimento}
                        onClick={() => setConsentimento((value) => !value)}
                        className="mt-5 flex items-start gap-3 text-left text-xs leading-5 text-ink-soft"
                      >
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${consentimento ? "border-violet-600 bg-violet-600 text-white" : "border-zinc-300 bg-white"}`}>
                          {consentimento ? <Check size={13} strokeWidth={3} /> : null}
                        </span>
                        Autorizo o uso anônimo da minha resposta para melhorar conteúdos e soluções sobre transição profissional.
                      </button>
                    </div>
                  )}
                </div>

                {error ? <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}

                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  {step > 1 ? (
                    <button type="button" onClick={() => setStep((value) => value - 1)} className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-ink-soft hover:text-ink">
                      <ChevronLeft size={18} /> Voltar
                    </button>
                  ) : <span />}

                  <button
                    type="button"
                    disabled={!canContinue || submitting}
                    onClick={() => (step === 4 ? void finishSurvey() : setStep((value) => value + 1))}
                    className="inline-flex min-h-12 items-center justify-center gap-8 rounded-xl bg-gradient-to-r from-violet-700 to-violet-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    {submitting ? "Enviando..." : step === 4 ? "Compartilhar experiência" : "Continuar"}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full border-8 border-violet-100 bg-violet-600 text-white shadow-xl shadow-violet-100">
                  <Check size={30} strokeWidth={3} />
                </span>
                <span className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-violet-700">Pesquisa concluída</span>
                <h2 className="mt-4 max-w-xl font-sans text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink md:text-4xl">
                  Sua experiência já está ajudando a construir algo melhor.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-ink-soft">
                  Obrigado por participar. Sua resposta foi registrada e ajudará a orientar novos conteúdos sobre carreira.
                </p>
                <Link
                  to="/busca"
                  search={{ q: "carreira" }}
                  className="mt-8 inline-flex min-h-12 items-center gap-8 rounded-xl bg-gradient-to-r from-violet-700 to-violet-600 px-7 text-sm font-black text-white shadow-lg shadow-violet-200"
                >
                  Ver conteúdos sobre carreira <ChevronRight size={18} />
                </Link>
                <button type="button" onClick={restart} className="mt-5 text-xs font-bold text-violet-700 hover:underline">
                  Responder novamente
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Question({ title, help, children }: { title: string; help: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mt-3 max-w-2xl font-sans text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink">{title}</h2>
      <p className="mt-2 text-sm text-ink-soft">{help}</p>
      <div className="mt-7 grid gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}
