export interface InstitucionalPage {
  titulo: string;
  descricao: string;
  corpo: string[];
}

export const institucionalPages: Record<string, InstitucionalPage> = {
  "quem-somos": {
    titulo: "Quem Somos",
    descricao: "Conheça o Tá Sabendo?, portal de notícias, bastidores e curiosidades.",
    corpo: [
      "O Tá Sabendo? nasceu para contar, com agilidade e cuidado editorial, o que está movimentando o mundo dos famosos, dos influenciadores, dos negócios e da tecnologia.",
      "Nossa equipe apura cada informação antes de publicar, sinaliza claramente quando algo ainda é rumor e atualiza matérias assim que novos fatos aparecem.",
      "Acreditamos que dá para fazer jornalismo de bastidores com leveza e responsabilidade ao mesmo tempo.",
    ],
  },
  "politica-editorial": {
    titulo: "Política Editorial",
    descricao: "Como apuramos, classificamos e publicamos nosso conteúdo.",
    corpo: [
      "Toda matéria publicada no Tá Sabendo? recebe uma classificação editorial: Confirmado, Relatado, Rumor, Análise ou Atualização — para que você saiba exatamente o nível de certeza da informação.",
      "Priorizamos fontes verificáveis. Quando uma informação parte de boato ou fonte anônima, isso fica explícito no texto e no selo de classificação.",
      "Correções e atualizações são sempre sinalizadas com data e horário, e o histórico de mudanças relevantes é preservado.",
    ],
  },
  correcoes: {
    titulo: "Política de Correções",
    descricao: "Como lidamos com erros e atualizações de conteúdo.",
    corpo: [
      "Errar faz parte do jornalismo — o que importa é corrigir rápido e com transparência.",
      "Quando uma informação publicada precisa ser corrigida, atualizamos o texto e adicionamos a marcação 'Atualizada' com a data da mudança, visível no topo da matéria.",
      "Encontrou um erro? Escreva para a nossa redação pelo canal de contato.",
    ],
  },
  privacidade: {
    titulo: "Política de Privacidade",
    descricao: "Como tratamos os dados de quem visita o Tá Sabendo?",
    corpo: [
      "Coletamos apenas os dados necessários para o funcionamento do site e, quando aplicável, para o envio da newsletter — sempre com seu consentimento explícito.",
      "Não vendemos dados pessoais a terceiros.",
      "Você pode solicitar a remoção dos seus dados a qualquer momento pelo canal de contato.",
    ],
  },
  termos: {
    titulo: "Termos de Uso",
    descricao: "Regras de uso do portal Tá Sabendo?",
    corpo: [
      "Ao acessar o Tá Sabendo?, você concorda em utilizar o conteúdo apenas para fins pessoais e não comerciais, salvo autorização prévia.",
      "É proibida a reprodução integral de matérias sem citação da fonte e link para o original.",
      "Reservamo-nos o direito de atualizar estes termos a qualquer momento.",
    ],
  },
  contato: {
    titulo: "Contato",
    descricao: "Fale com a redação do Tá Sabendo?",
    corpo: [
      "Tem uma pauta, uma correção ou quer enviar um furo? Fale com a nossa redação.",
      "E-mail: redacao@tasabendo.com.br",
      "Respondemos o mais rápido possível — bastidores não esperam.",
    ],
  },
  anuncie: {
    titulo: "Anuncie",
    descricao: "Leve sua marca para o público do Tá Sabendo?",
    corpo: [
      "O Tá Sabendo? conecta marcas a um público engajado e apaixonado por cultura, tecnologia e bastidores.",
      "Trabalhamos com formatos nativos, banners e conteúdo patrocinado, sempre identificado como publicidade.",
      "Fale com o time comercial pelo canal de contato para receber nosso media kit.",
    ],
  },
  carreiras: {
    titulo: "Trabalhe Conosco",
    descricao: "Vagas e oportunidades no Tá Sabendo?",
    corpo: [
      "Estamos sempre de olho em gente boa para reforçar a redação: repórteres, editores e gente que entende de mídias sociais.",
      "Não há vagas abertas no momento, mas você pode enviar seu portfólio pelo canal de contato para ficarmos de olho.",
    ],
  },
};
