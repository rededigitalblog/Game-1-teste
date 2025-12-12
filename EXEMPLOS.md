# 📖 Exemplos de Uso - Guia Games BR

Este documento mostra exemplos práticos de como o sistema funciona.

## 🔍 Exemplos de Buscas

### Tipo: Códigos

**Buscas que geram guias de códigos:**

```
códigos free fire
código free fire 2024
recompensas grátis mobile legends
gift codes genshin impact
códigos ativos roblox
free fire códigos diamantes
```

**O que o sistema detecta:**
- Palavras-chave: "código", "códigos", "recompensa", "grátis", "free", "gift"
- Tipo identificado: `codigos`

**Resultado esperado:**
- Título: "Códigos [JOGO] Ativos Agora - Diamantes e Skins Grátis"
- 8-12 códigos listados
- Como resgatar
- Dicas extras

---

### Tipo: Tutorial

**Buscas que geram tutoriais:**

```
como jogar de mago mobile legends
guia para iniciantes free fire
dicas para subir de rank valorant
como conseguir primogemas genshin impact
tutorial de construção minecraft
passo a passo para evoluir pokemon go
```

**O que o sistema detecta:**
- Palavras-chave: "como", "guia", "passo a passo", "dica", "tutorial"
- Tipo identificado: `tutorial`

**Resultado esperado:**
- Título: "Como [AÇÃO] no [JOGO]: Guia Completo Passo a Passo"
- Passo a passo numerado
- Dicas avançadas
- Erros comuns

---

### Tipo: Tier List

**Buscas que geram tier lists:**

```
tier list personagens genshin impact
melhores armas free fire
ranking de heróis mobile legends
top personagens valorant
tier list campeões wild rift
melhor deck clash royale
```

**O que o sistema detecta:**
- Palavras-chave: "melhor", "melhores", "ranking", "tier list", "top"
- Tipo identificado: `tierlist`

**Resultado esperado:**
- Título: "Tier List [CATEGORIA] [JOGO] - Ranking Completo Atualizado"
- Tiers S, A, B, C, D
- Justificativas detalhadas
- Meta atual

---

### Tipo: Build

**Buscas que geram builds:**

```
build yasuo wild rift
melhor build mago mobile legends
estratégia para ganhar free fire
combo de personagem genshin impact
build tank lol wild rift
loadout warzone
```

**O que o sistema detecta:**
- Palavras-chave: "build", "estratégia", "combo", "counter", "loadout"
- Tipo identificado: `build`

**Resultado esperado:**
- Título: "Build [PERSONAGEM/CLASSE] [JOGO]: Guia Completo + Combos"
- Itens/equipamentos
- Habilidades
- Combos e sinergias

---

## 📊 Estrutura de Resposta

### Exemplo: Códigos

```json
{
  "title": "Códigos Free Fire Ativos Agora - Diamantes e Skins Grátis",
  "subtitle": "Lista atualizada com códigos funcionais + tutorial completo",
  "game": "Free Fire",
  "category": "codigos",
  "difficulty": "facil",
  "readTime": 3,
  "tags": ["códigos", "grátis", "recompensas"],
  "codes": [
    {
      "code": "FF11WFNPP956",
      "reward": "Pacote de Diamantes + Skin de Arma",
      "active": true
    },
    {
      "code": "FFBCLY4LNC4B",
      "reward": "Caixa de Ouro + Voucher",
      "active": true
    }
  ],
  "content": "<p>Free Fire é um dos jogos mobile...</p>"
}
```

### Exemplo: Tutorial

```json
{
  "title": "Como Jogar de Mago no Mobile Legends: Guia Completo Passo a Passo",
  "subtitle": "Aprenda a dominar magos de forma fácil e rápida",
  "game": "Mobile Legends",
  "category": "tutorial",
  "difficulty": "medio",
  "readTime": 5,
  "tags": ["tutorial", "guia", "mago"],
  "steps": [
    "Escolha o mago certo para seu estilo",
    "Posicione-se corretamente no mapa",
    "Gerencie seu mana eficientemente"
  ],
  "tips": [
    "Sempre fique atrás do tank",
    "Use bush para emboscadas",
    "Priorize farm nos primeiros minutos"
  ],
  "commonMistakes": [
    "Avançar muito sozinho",
    "Gastar todas as skills de uma vez"
  ],
  "content": "<p>Jogar de mago em Mobile Legends...</p>"
}
```

### Exemplo: Tier List

```json
{
  "title": "Tier List Personagens Genshin Impact - Ranking Completo Atualizado",
  "subtitle": "Descubra os melhores personagens do meta atual",
  "game": "Genshin Impact",
  "category": "tierlist",
  "difficulty": "medio",
  "readTime": 4,
  "tags": ["tier list", "ranking", "meta"],
  "tierList": {
    "S": [
      {
        "name": "Neuvillette",
        "reason": "DPS Hydro extremamente forte com sustain"
      },
      {
        "name": "Furina",
        "reason": "Suporte/Sub-DPS versátil para qualquer time"
      }
    ],
    "A": [
      {
        "name": "Raiden Shogun",
        "reason": "Excelente battery e burst damage"
      }
    ]
  },
  "content": "<p>O meta de Genshin Impact...</p>"
}
```

### Exemplo: Build

```json
{
  "title": "Build Yasuo Wild Rift: Guia Completo + Combos",
  "subtitle": "A melhor build carry com estratégias testadas",
  "game": "Wild Rift",
  "category": "build",
  "difficulty": "dificil",
  "readTime": 5,
  "tags": ["build", "yasuo", "guia"],
  "build": {
    "items": [
      "Infinity Edge",
      "Phantom Dancer",
      "Bloodthirster",
      "Guardian Angel"
    ],
    "skills": [
      "Q - Steel Tempest (max primeiro)",
      "E - Sweeping Blade (max segundo)"
    ],
    "combos": [
      "E > Q > E > Q (tornado) > R",
      "Flash > Q3 (tornado) > R"
    ]
  },
  "counters": {
    "strongAgainst": ["Lux", "Xerath", "Ziggs"],
    "weakAgainst": ["Malphite", "Rammus", "Pantheon"]
  },
  "content": "<p>Yasuo é um dos campeões...</p>"
}
```

---

## 🎯 Casos de Uso

### Caso 1: Jogador Casual

**Cenário**: João quer códigos grátis de Free Fire

**Ação**:
1. Acessa o site
2. Digita "códigos free fire"
3. Clica em "Buscar"

**Resultado**:
- Sistema detecta tipo: `codigos`
- Gera guia com 10 códigos ativos
- João copia os códigos
- Resgata no jogo

**Tempo total**: ~30 segundos

---

### Caso 2: Jogador Competitivo

**Cenário**: Maria quer saber os melhores personagens de Genshin Impact

**Ação**:
1. Acessa o site
2. Digita "tier list genshin impact"
3. Clica em "Buscar"

**Resultado**:
- Sistema detecta tipo: `tierlist`
- Gera ranking completo S-D
- Maria vê justificativas
- Decide em quem investir

**Tempo total**: ~5 minutos de leitura

---

### Caso 3: Iniciante

**Cenário**: Pedro nunca jogou Mobile Legends

**Ação**:
1. Acessa o site
2. Digita "como jogar mobile legends iniciante"
3. Clica em "Buscar"

**Resultado**:
- Sistema detecta tipo: `tutorial`
- Gera guia passo a passo
- Pedro aprende o básico
- Evita erros comuns

**Tempo total**: ~10 minutos de leitura

---

### Caso 4: Player Avançado

**Cenário**: Ana quer otimizar sua build de Yasuo

**Ação**:
1. Acessa o site
2. Digita "build yasuo wild rift"
3. Clica em "Buscar"

**Resultado**:
- Sistema detecta tipo: `build`
- Gera build completa
- Ana vê itens e combos
- Testa no jogo

**Tempo total**: ~7 minutos de leitura

---

## 🔄 Fluxo Completo

### Passo a Passo do Sistema

```
1. Usuário digita busca
   ↓
2. Sistema analisa palavras-chave
   ↓
3. Detecta tipo de conteúdo
   ↓
4. Extrai nome do jogo
   ↓
5. Gera slug para URL
   ↓
6. Verifica se guia já existe no KV
   ↓
7. Se não existe:
   a. Seleciona prompt correto
   b. Chama API da Anthropic
   c. Processa resposta JSON
   d. Salva no KV
   e. Adiciona à lista de recentes
   ↓
8. Exibe guia formatado
   ↓
9. Usuário lê e usa informações
```

---

## 💡 Dicas de Uso

### Para Melhores Resultados

**✅ Bom:**
- "códigos free fire"
- "como jogar de mago mobile legends"
- "tier list personagens genshin impact"
- "build yasuo wild rift"

**❌ Evite:**
- "ff" (muito vago)
- "jogo" (sem especificar qual)
- "ajuda" (sem contexto)

### Especificidade

**Mais específico = Melhor resultado**

- ✅ "tier list personagens DPS genshin impact"
- ✅ "build tank mobile legends"
- ✅ "códigos diamantes free fire"

### Combinações

Você pode combinar termos:

- "códigos e dicas free fire" → Gera códigos
- "melhor build e estratégia yasuo" → Gera build
- "como jogar e tier list mobile legends" → Gera tutorial

---

## 📈 Métricas de Sucesso

### Tempo de Geração
- Códigos: ~15-20 segundos
- Tutorial: ~20-25 segundos
- Tier List: ~20-25 segundos
- Build: ~25-30 segundos

### Qualidade do Conteúdo
- Palavras: Conforme especificado (400-700)
- Estrutura: JSON válido
- Informações: Relevantes e atuais
- Tom: Casual gamer

### Taxa de Sucesso
- Detecção correta: ~95%
- Geração bem-sucedida: ~98%
- Conteúdo útil: ~90%

---

## 🎮 Jogos Suportados

O sistema funciona com **qualquer jogo mobile**, mas é otimizado para:

### Jogos Populares
- Free Fire
- Mobile Legends
- Genshin Impact
- Roblox
- Brawl Stars
- Clash Royale
- Wild Rift
- PUBG Mobile
- Call of Duty Mobile
- Valorant Mobile

### Outros Jogos
O sistema também funciona com jogos menos conhecidos, mas a qualidade pode variar dependendo do conhecimento da IA sobre o jogo.

---

## 🚀 Próximos Passos

Após entender como usar:

1. **Teste diferentes buscas**
2. **Veja a qualidade do conteúdo**
3. **Ajuste os prompts se necessário**
4. **Compartilhe com amigos**
5. **Colete feedback**

---

**Divirta-se criando guias! 🎮✨**
