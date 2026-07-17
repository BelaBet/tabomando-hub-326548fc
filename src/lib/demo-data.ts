// Demo/fictional content for "Tá Sabendo?" — clearly labeled as demonstration.
// Nothing here refers to real individuals or events.

export type ClassificacaoEditorial =
  | "Confirmado"
  | "Relatado"
  | "Rumor"
  | "Análise"
  | "Atualização";

export type StatusMateria =
  | "Rascunho"
  | "Em revisão"
  | "Agendada"
  | "Publicada"
  | "Atualizada"
  | "Arquivada";

export interface Categoria {
  slug: string;
  nome: string;
  descricao: string;
  cor?: string;
}

export interface Autor {
  slug: string;
  nome: string;
  bio: string;
  cargo: string;
}

export interface Materia {
  slug: string;
  categoria: string; // slug da categoria
  titulo: string;
  subtitulo: string;
  resumo: string;
  conteudo: string[]; // parágrafos
  autor: string; // slug do autor
  publicadoEm: string; // ISO
  atualizadoEm?: string;
  tempoLeitura: number; // min
  imagem: string;
  legendaImagem: string;
  creditoImagem: string;
  classificacao: ClassificacaoEditorial;
  destaque?: boolean;
  manchete?: boolean;
  visualizacoes: number;
  fontes: { titulo: string; url?: string }[];
  resumoRapido: {
    quem: string;
    oQue: string;
    quando: string;
    situacao: string;
    fontePrincipal: string;
  };
  taSabendoDisso?: string;
  tags: string[];
}

export interface Perfil {
  slug: string;
  nome: string;
  tipo: "Celebridade" | "Influenciador" | "Empresa";
  descricao: string;
  imagem: string;
  seguidores?: string;
  fatos: string[];
}

export const categorias: Categoria[] = [
  { slug: "ta-bombando", nome: "Tá Bombando", descricao: "Os assuntos mais quentes do momento." },
  { slug: "famosos", nome: "Famosos", descricao: "Bastidores, encontros e polêmicas do mundo das celebridades." },
  { slug: "influenciadores", nome: "Influenciadores", descricao: "Quem manda nos feeds, para o bem e para o mal." },
  { slug: "dinheiro", nome: "Dinheiro", descricao: "Fortunas, cachês, contratos e o que mexe com a sua carteira." },
  { slug: "negocios", nome: "Negócios", descricao: "Bastidores de empresas, fusões e disputas corporativas." },
  { slug: "tecnologia", nome: "Tecnologia", descricao: "IA, apps, gadgets e o vale do silício brasileiro." },
  { slug: "curiosidades", nome: "Curiosidades", descricao: "Aquelas histórias que você não sabia — e vai querer contar." },
  { slug: "fato-ou-rumor", nome: "Fato ou Rumor", descricao: "A gente separa o que é real do que é papo furado." },
];

export const autores: Autor[] = [
  {
    slug: "rita-fofoqueira",
    nome: "Rita Bastos",
    cargo: "Editora-chefe de Famosos",
    bio: "Repórter há 15 anos cobrindo entretenimento e cultura pop. Personagem fictício para demonstração.",
  },
  {
    slug: "leo-mercado",
    nome: "Léo Mercado",
    cargo: "Editor de Dinheiro e Negócios",
    bio: "Cobre bastidores corporativos e mercado financeiro. Personagem fictício para demonstração.",
  },
  {
    slug: "nina-tech",
    nome: "Nina Prado",
    cargo: "Repórter de Tecnologia",
    bio: "Escreve sobre IA, startups e vida digital. Personagem fictício para demonstração.",
  },
];

const img = (seed: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const materias: Materia[] = [
  {
    slug: "estrela-fictícia-aparece-em-evento-surpresa-na-avenida-paulista",
    categoria: "famosos",
    titulo: "Estrela fictícia aparece em evento surpresa na Avenida Paulista e quebra a internet",
    subtitulo: "Personagem inventada para demonstração desce de carro preto, distribui autógrafos e some em minutos",
    resumo:
      "Cena fictícia com uma celebridade imaginária mobilizou fãs também fictícios em uma tarde de sábado. Confira o que a redação apurou (em cenário de demonstração).",
    conteudo: [
      "AVISO: este é um conteúdo de demonstração criado exclusivamente para ilustrar o portal Tá Sabendo?. Nenhuma pessoa real é retratada aqui.",
      "Segundo relatos fictícios coletados por nossa redação-demo, a personagem inventada 'Estrela X' desceu de um carro preto na Avenida Paulista por volta das 15h, cumprimentou fãs e entrou em um prédio comercial não identificado.",
      "A aparição não foi confirmada por nenhuma assessoria (o que faz sentido, considerando que a pessoa não existe). Ainda assim, o episódio serve para mostrar como uma matéria de bastidores seria estruturada no portal.",
      "Fontes fictícias afirmam que o evento pode ter relação com um contrato publicitário. Vamos continuar apurando — em cenário de demonstração.",
    ],
    autor: "rita-fofoqueira",
    publicadoEm: "2026-07-16T14:32:00-03:00",
    atualizadoEm: "2026-07-17T09:10:00-03:00",
    tempoLeitura: 4,
    imagem: img("1503342217505-b0a15ec3261c"),
    legendaImagem: "Imagem ilustrativa — cena reconstruída para demonstração.",
    creditoImagem: "Foto: Unsplash / demonstração",
    classificacao: "Relatado",
    manchete: true,
    destaque: true,
    visualizacoes: 128430,
    fontes: [
      { titulo: "Relato de leitor fictício enviado à redação" },
      { titulo: "Vídeo de circuito interno (demonstração)" },
    ],
    resumoRapido: {
      quem: "Personagem fictícia 'Estrela X'",
      oQue: "Aparição inesperada em evento na Avenida Paulista",
      quando: "Sábado, 16/07, por volta das 15h",
      situacao: "Relatado — sem confirmação oficial",
      fontePrincipal: "Relatos de leitores (demo)",
    },
    taSabendoDisso:
      "A Avenida Paulista já foi palco de mais de 200 eventos com celebridades registrados por veículos de imprensa nos últimos 10 anos (dado ilustrativo).",
    tags: ["famosos", "sao-paulo", "aparição"],
  },
  {
    slug: "influenciadora-inventada-anuncia-marca-de-cafe-e-esgota-em-2-horas",
    categoria: "influenciadores",
    titulo: "Influenciadora inventada anuncia marca de café e esgota estoque em 2 horas",
    subtitulo: "Lançamento fictício movimenta creators e mostra o poder do comércio social",
    resumo: "Case fictício mostra como um lançamento coordenado com creators pode esgotar estoques.",
    conteudo: [
      "AVISO: conteúdo de demonstração. A pessoa e a marca citadas não existem.",
      "A creator fictícia 'Manu Ribeirão' anunciou às 10h a linha 'Café da Manu', com edição limitada de 5.000 unidades.",
      "Segundo dados fictícios de vendas, o estoque acabou em 2h07min, com pico de acessos concentrado em stories.",
      "O caso demonstra como a página de bastidores comerciais funciona no portal.",
    ],
    autor: "leo-mercado",
    publicadoEm: "2026-07-16T10:00:00-03:00",
    tempoLeitura: 3,
    imagem: img("1495474472287-4d71bcdd2085"),
    legendaImagem: "Xícara de café — imagem ilustrativa.",
    creditoImagem: "Foto: Unsplash / demonstração",
    classificacao: "Confirmado",
    destaque: true,
    visualizacoes: 84210,
    fontes: [{ titulo: "Press release fictício da marca" }],
    resumoRapido: {
      quem: "Creator fictícia Manu Ribeirão",
      oQue: "Lançamento de linha de café",
      quando: "16/07, 10h",
      situacao: "Confirmado (cenário demo)",
      fontePrincipal: "Assessoria fictícia",
    },
    tags: ["influenciadores", "creator-economy"],
  },
  {
    slug: "startup-ficticia-de-ia-capta-r-200-milhoes-em-rodada-relampago",
    categoria: "tecnologia",
    titulo: "Startup fictícia de IA capta R$ 200 milhões em rodada relâmpago",
    subtitulo: "Empresa demo 'NeuroPampa' quer competir com gigantes globais",
    resumo: "Rodada fictícia teria sido fechada em menos de duas semanas, segundo fontes de demonstração.",
    conteudo: [
      "AVISO: cenário de demonstração. A empresa 'NeuroPampa' não existe.",
      "A empresa fictícia teria fechado uma Série B de R$ 200 milhões liderada por um fundo internacional imaginário.",
      "O uso previsto dos recursos, também fictício, envolve expansão de datacenter e contratação de 120 engenheiros.",
    ],
    autor: "nina-tech",
    publicadoEm: "2026-07-15T18:20:00-03:00",
    tempoLeitura: 5,
    imagem: img("1518770660439-4636190af475"),
    legendaImagem: "Circuito eletrônico — imagem ilustrativa.",
    creditoImagem: "Foto: Unsplash / demonstração",
    classificacao: "Relatado",
    destaque: true,
    visualizacoes: 51230,
    fontes: [{ titulo: "Fontes próximas à operação (fictícias)" }],
    resumoRapido: {
      quem: "Startup fictícia NeuroPampa",
      oQue: "Captação de R$ 200 milhões",
      quando: "Semana de 07/07 a 15/07 (demo)",
      situacao: "Relatado — sem confirmação pública",
      fontePrincipal: "Fontes anônimas (demo)",
    },
    tags: ["ia", "startups", "captação"],
  },
  {
    slug: "banco-imaginario-troca-cnpj-e-mercado-especula",
    categoria: "negocios",
    titulo: "Banco imaginário troca CNPJ e mercado especula sobre fusão",
    subtitulo: "Movimentação societária fictícia gera burburinho em cenário demo",
    resumo: "Alteração cadastral fictícia levanta hipóteses sobre reorganização de grupo financeiro imaginado.",
    conteudo: [
      "AVISO: cenário de demonstração. O 'Banco Imaginário' não existe.",
      "Segundo documento fictício, o grupo teria movimentado sua estrutura societária no dia 14/07.",
      "Analistas de demonstração enxergam a movimentação como preparo para uma fusão que ainda não foi confirmada.",
    ],
    autor: "leo-mercado",
    publicadoEm: "2026-07-15T09:15:00-03:00",
    tempoLeitura: 4,
    imagem: img("1554224155-6726b3ff858f"),
    legendaImagem: "Fachada de banco — imagem ilustrativa.",
    creditoImagem: "Foto: Unsplash / demonstração",
    classificacao: "Análise",
    visualizacoes: 33200,
    fontes: [{ titulo: "Documento fictício de alteração societária" }],
    resumoRapido: {
      quem: "Banco Imaginário S.A. (fictício)",
      oQue: "Alteração de CNPJ",
      quando: "14/07 (demo)",
      situacao: "Análise",
      fontePrincipal: "Documento fictício",
    },
    tags: ["bancos", "fusões"],
  },
  {
    slug: "boato-sobre-casal-de-atores-fictícios-e-desmentido",
    categoria: "fato-ou-rumor",
    titulo: "Boato sobre casal de atores fictícios é desmentido",
    subtitulo: "Print circulou em grupos de WhatsApp inventados durante o fim de semana",
    resumo: "Assessorias imaginárias negam informação que circulou em grupos fictícios.",
    conteudo: [
      "AVISO: conteúdo de demonstração. Não há pessoas reais envolvidas.",
      "O print fictício sugeria uma separação — mas a versão foi negada por ambas as assessorias imaginárias.",
      "Classificação: rumor não confirmado.",
    ],
    autor: "rita-fofoqueira",
    publicadoEm: "2026-07-14T21:00:00-03:00",
    tempoLeitura: 2,
    imagem: img("1522199755839-a2bacb67c546"),
    legendaImagem: "Celular sobre a mesa — imagem ilustrativa.",
    creditoImagem: "Foto: Unsplash / demonstração",
    classificacao: "Rumor",
    visualizacoes: 91020,
    fontes: [{ titulo: "Nota fictícia da assessoria" }],
    resumoRapido: {
      quem: "Casal fictício de atores",
      oQue: "Suposta separação",
      quando: "Fim de semana de 12-13/07",
      situacao: "Rumor — desmentido",
      fontePrincipal: "Assessorias fictícias",
    },
    tags: ["fato-ou-rumor"],
  },
  {
    slug: "aplicativo-ficticio-promete-detectar-fofoca-antes-de-viralizar",
    categoria: "tecnologia",
    titulo: "Aplicativo fictício promete detectar fofoca antes de viralizar",
    subtitulo: "App inventado usa IA imaginária para 'prever' assuntos em alta",
    resumo: "Ferramenta de demonstração ilustra como uma nova categoria de produto poderia existir.",
    conteudo: [
      "AVISO: conteúdo de demonstração. O aplicativo não existe.",
      "O app fictício 'Prevê Boato' analisa padrões inventados em redes sociais.",
      "A ideia é bonita no papel — e, por enquanto, só no papel mesmo.",
    ],
    autor: "nina-tech",
    publicadoEm: "2026-07-14T12:00:00-03:00",
    tempoLeitura: 3,
    imagem: img("1517430816045-df4b7de11d1d"),
    legendaImagem: "Tela de aplicativo — imagem ilustrativa.",
    creditoImagem: "Foto: Unsplash / demonstração",
    classificacao: "Análise",
    visualizacoes: 24010,
    fontes: [{ titulo: "Site fictício do produto" }],
    resumoRapido: {
      quem: "App fictício 'Prevê Boato'",
      oQue: "Lançamento anunciado",
      quando: "14/07 (demo)",
      situacao: "Análise",
      fontePrincipal: "Site fictício",
    },
    tags: ["apps", "ia"],
  },
  {
    slug: "voce-sabia-que-a-fofoca-tem-cadeira-em-universidade",
    categoria: "curiosidades",
    titulo: "Você sabia que a fofoca tem cadeira em universidade?",
    subtitulo: "Estudo demo aponta o papel social do 'burburinho' na formação de comunidades",
    resumo: "Dado curioso e verificado (em cenário de demonstração) sobre pesquisas em antropologia.",
    conteudo: [
      "AVISO: conteúdo de demonstração. Referências abaixo são ilustrativas.",
      "Pesquisas fictícias em antropologia tratam a fofoca como mecanismo de coesão social.",
      "É como se cada boato fosse um cimento invisível — cheio de rachaduras.",
    ],
    autor: "nina-tech",
    publicadoEm: "2026-07-13T08:00:00-03:00",
    tempoLeitura: 2,
    imagem: img("1522202176988-66273c2fd55f"),
    legendaImagem: "Sala de aula — imagem ilustrativa.",
    creditoImagem: "Foto: Unsplash / demonstração",
    classificacao: "Confirmado",
    visualizacoes: 15200,
    fontes: [{ titulo: "Estudo fictício de antropologia social" }],
    resumoRapido: {
      quem: "Pesquisadores fictícios",
      oQue: "Papel social da fofoca",
      quando: "Referências ilustrativas",
      situacao: "Confirmado (demo)",
      fontePrincipal: "Estudo fictício",
    },
    tags: ["curiosidades", "ciência"],
  },
];

export const perfis: Perfil[] = [
  {
    slug: "estrela-x",
    nome: "Estrela X",
    tipo: "Celebridade",
    descricao: "Personagem fictícia usada para demonstrar páginas de perfil de celebridade no portal.",
    imagem: img("1494790108377-be9c29b29330", 600, 600),
    seguidores: "24,3 mi",
    fatos: [
      "Personagem criada exclusivamente para demonstração.",
      "Já protagonizou 8 aparições fictícias em nossa cobertura demo.",
      "Não representa nenhuma pessoa real.",
    ],
  },
  {
    slug: "manu-ribeirao",
    nome: "Manu Ribeirão",
    tipo: "Influenciador",
    descricao: "Creator fictícia usada para ilustrar perfis de influenciadores.",
    imagem: img("1531123897727-8f129e1688ce", 600, 600),
    seguidores: "5,1 mi",
    fatos: [
      "Personagem fictícia.",
      "Ilustra o mercado de creator economy no cenário demo.",
    ],
  },
  {
    slug: "neuropampa",
    nome: "NeuroPampa",
    tipo: "Empresa",
    descricao: "Startup fictícia de IA usada para demonstrar perfis empresariais.",
    imagem: img("1518770660439-4636190af475", 600, 600),
    fatos: [
      "Empresa inventada para demonstração.",
      "Sede fictícia em Porto Alegre.",
    ],
  },
];

export const taBombando = [
  "Estrela X",
  "Café da Manu",
  "NeuroPampa",
  "Banco Imaginário",
  "Prevê Boato",
  "Rumor do fim de semana",
  "IA generativa BR",
  "Creator Economy",
];

export function getCategoria(slug: string) {
  return categorias.find((c) => c.slug === slug);
}
export function getAutor(slug: string) {
  return autores.find((a) => a.slug === slug);
}
export function getMateria(slug: string) {
  return materias.find((m) => m.slug === slug);
}
export function getPerfil(slug: string) {
  return perfis.find((p) => p.slug === slug);
}
export function materiasPorCategoria(slug: string) {
  return materias.filter((m) => m.categoria === slug);
}
export function ultimasMaterias(limit = 10) {
  return [...materias].sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm)).slice(0, limit);
}
export function maisLidas(limit = 5) {
  return [...materias].sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, limit);
}

export function formatarData(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
