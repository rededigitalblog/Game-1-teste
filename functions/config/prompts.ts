import type { ContentType } from '../../src/types';

// ============================================
// PROMPTS PARA CLAUDE API
// ============================================

const SYSTEM_PROMPT = `Você é um especialista em jogos mobile com foco no público brasileiro.

DIRETRIZES GERAIS:
- Linguagem: Português BR, tom casual mas profissional
- Conteúdo: Sempre atualizado e factual
- Formato: Retornar APENAS JSON válido, sem markdown
- Temporal: Use "atualmente", "agora", evite datas específicas
- SEO: Incluir palavras-chave naturalmente
- Qualidade: Informações precisas e verificáveis

RESTRIÇÕES:
- NÃO inventar códigos falsos
- NÃO usar linguagem ofensiva
- NÃO fazer promessas impossíveis
- NÃO copiar conteúdo de outros sites literalmente`;

export const PROMPTS: Record<ContentType, (topic: string, game: string) => string> = {
  codigos: (topic: string, game: string) => `
Crie um guia completo de CÓDIGOS ATIVOS para o jogo: ${game}

REQUISITOS:
- Extensão: 400-600 palavras
- Listar 8-12 códigos reais e verificados
- Cada código deve ter: nome, recompensa, status (ativo/expirado)
- Incluir tutorial de como resgatar
- Alertas importantes (case-sensitive, região, etc)

ESTRUTURA HTML:
1. Introdução (2-3 parágrafos)
2. Lista de códigos (usar <ul> com <strong> para o código)
3. Como resgatar (passo a passo numerado)
4. Dicas extras

JSON ESPERADO:
{
  "title": "Códigos ${game} Ativos Agora - Recompensas Grátis",
  "subtitle": "Lista atualizada com códigos funcionais + tutorial completo",
  "metaDescription": "Códigos ativos de ${game} para resgatar diamantes, skins e recompensas grátis. Tutorial completo de como usar.",
  "game": "${game}",
  "category": "codigos",
  "difficulty": "facil",
  "readTime": 3,
  "tags": ["códigos", "grátis", "recompensas", "${game.toLowerCase()}"],
  "imageQuery": "${game} game mobile codes rewards",
  "codes": [
    {
      "code": "EXEMPLO123",
      "reward": "100 Diamantes + Skin Exclusiva",
      "active": true,
      "notes": "Case-sensitive, válido até o fim do mês"
    }
  ],
  "content": "<p>Introdução...</p><h2>Códigos Ativos</h2><ul><li><strong>CODIGO1</strong> - Recompensa</li></ul>..."
}

IMPORTANTE: Pesquise códigos reais que estejam funcionando. Se não encontrar códigos verificados, informe no JSON que são códigos históricos ou de exemplo.
`,

  tutorial: (topic: string, game: string) => `
Crie um guia TUTORIAL completo sobre: ${topic} no jogo ${game}

REQUISITOS:
- Extensão: 500-700 palavras
- Passo a passo detalhado e numerado
- Incluir dicas profissionais
- Mencionar erros comuns e como evitar
- Usar exemplos práticos

ESTRUTURA HTML:
1. Introdução: O que é e por que é importante
2. Pré-requisitos (se houver)
3. Passo a passo (<ol> numerado)
4. Dicas avançadas
5. Erros comuns
6. Conclusão

JSON ESPERADO:
{
  "title": "Como ${topic} no ${game}: Guia Completo Passo a Passo",
  "subtitle": "Aprenda ${topic} de forma fácil e rápida",
  "metaDescription": "Guia completo de como ${topic} no ${game}. Tutorial passo a passo com dicas profissionais e erros comuns.",
  "game": "${game}",
  "category": "tutorial",
  "difficulty": "medio",
  "readTime": 5,
  "tags": ["tutorial", "guia", "${topic.toLowerCase()}", "${game.toLowerCase()}"],
  "imageQuery": "${game} ${topic} tutorial gameplay",
  "steps": [
    "Passo 1: Descrição detalhada",
    "Passo 2: Descrição detalhada"
  ],
  "tips": [
    "Dica profissional 1",
    "Dica profissional 2"
  ],
  "commonMistakes": [
    "Erro comum 1 e como evitar",
    "Erro comum 2 e como evitar"
  ],
  "content": "<p>Introdução...</p><h2>Passo a Passo</h2><ol><li>...</li></ol>..."
}
`,

  tierlist: (topic: string, game: string) => `
Crie uma TIER LIST atualizada de ${topic} para o jogo: ${game}

REQUISITOS:
- Extensão: 450-650 palavras
- Classificação: S, A, B, C, D
- Mínimo 15 itens ranqueados
- Justificativa clara para cada tier
- Baseado no meta atual
- Mencionar mudanças recentes (sem data específica)

ESTRUTURA HTML:
1. Introdução + critérios
2. Tier S (os melhores - 3-5 itens)
3. Tier A (ótimos - 4-6 itens)
4. Tier B (bons - 4-5 itens)
5. Tier C/D (evitar - 3-4 itens)
6. Considerações finais

JSON ESPERADO:
{
  "title": "Tier List ${topic} ${game} - Ranking Completo Atualizado",
  "subtitle": "Descubra os melhores ${topic} do meta atual",
  "metaDescription": "Tier List completa de ${topic} no ${game}. Ranking S, A, B, C, D com justificativas baseadas no meta atual.",
  "game": "${game}",
  "category": "tierlist",
  "difficulty": "medio",
  "readTime": 4,
  "tags": ["tier list", "ranking", "${topic.toLowerCase()}", "${game.toLowerCase()}"],
  "imageQuery": "${game} ${topic} tier list ranking",
  "tierList": {
    "S": [
      {"name": "Item 1", "reason": "Justificativa detalhada", "icon": "⭐"}
    ],
    "A": [],
    "B": [],
    "C": [],
    "D": []
  },
  "content": "<p>Introdução...</p><h2>Tier S - Os Melhores</h2><ul>...</ul>..."
}
`,

  build: (topic: string, game: string) => `
Crie uma BUILD/ESTRATÉGIA completa para: ${topic} no jogo ${game}

REQUISITOS:
- Extensão: 500-700 palavras
- Build específica (itens, habilidades, ordem)
- Combos e sinergias
- Matchups (counters)
- Estilo de jogo

ESTRUTURA HTML:
1. Visão geral da build
2. Itens em ordem de prioridade
3. Habilidades/Talentos/Runas
4. Combos principais
5. Matchups (forte contra / fraco contra)
6. Dicas avançadas

JSON ESPERADO:
{
  "title": "Build ${topic} ${game}: Guia Completo + Combos",
  "subtitle": "A melhor build ${topic} com estratégias testadas",
  "metaDescription": "Build completa de ${topic} no ${game}. Itens, habilidades, combos e matchups para dominar o jogo.",
  "game": "${game}",
  "category": "build",
  "difficulty": "dificil",
  "readTime": 5,
  "tags": ["build", "estratégia", "${topic.toLowerCase()}", "${game.toLowerCase()}"],
  "imageQuery": "${game} ${topic} build strategy",
  "build": {
    "items": [
      {"name": "Item 1", "order": 1, "reason": "Justificativa"}
    ],
    "skills": ["Ordem de evolução das habilidades"],
    "combos": ["Descrição do combo 1"]
  },
  "counters": {
    "strongAgainst": ["Personagem 1", "Personagem 2"],
    "weakAgainst": ["Personagem 3", "Personagem 4"]
  },
  "content": "<p>Introdução...</p><h2>Itens Essenciais</h2><ol>...</ol>..."
}
`
};

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function getUserPrompt(type: ContentType, topic: string, game: string): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  // Considera "final de ano" a partir de Outubro (mês 9) para já começar a rankear para o ano seguinte
  const isLateYear = now.getMonth() >= 9;

  // Define qual ano a IA deve priorizar nos títulos
  const targetYear = isLateYear ? nextYear : currentYear;

  const yearContext = `
CONTEXTO TEMPORAL OBRIGATÓRIO:
- Hoje é: ${now.toLocaleDateString('pt-BR')}
- Ano para Títulos: Use "${targetYear}" ou termos como "Atuais", "Hoje", "Recentes", "Atualizado".
- PROIBIDO: Usar anos anteriores a ${currentYear} (ex: ${currentYear - 1}) nos títulos, a menos que seja um artigo histórico.
- SE O USUÁRIO PEDIR UM ANO ANTIGO NA QUERY, SUBSTITUA PELO ANO ATUAL/FUTURO NO TÍTULO E CONTEÚDO.
- NOTA: Para aumentar o CTR, prefira "Ativos Agora" ou "${targetYear}" em vez de deixar sem data.
`;

  const promptFunction = PROMPTS[type];
  return yearContext + promptFunction(topic, game);
}
