# 🎮 Guia Games BR - Blog Autônomo Profissional

Sistema de blog autônomo que gera conteúdo de qualidade sobre jogos mobile usando IA Claude Sonnet 4.

## 📋 Visão Geral

- **Stack**: React 18 + TypeScript + Vite 5 + Tailwind CSS 3.4
- **Backend**: Cloudflare Workers (serverless)
- **Storage**: Cloudflare KV
- **IA**: Anthropic Claude Sonnet 4
- **Deploy**: Cloudflare Pages

## ✨ Funcionalidades

### Detecção Automática de Conteúdo
O sistema identifica automaticamente o tipo de guia:
- 🎁 **Códigos** (400-600 palavras)
- 📚 **Tutoriais** (500-700 palavras)
- 🏆 **Tier Lists** (450-650 palavras)
- ⚡ **Builds** (500-700 palavras)

### Sistema de Cache Inteligente
- Cache no Cloudflare KV (TTL: 7 dias)
- Não regera conteúdo duplicado
- Stale-while-revalidate

### SEO Otimizado
- Meta tags dinâmicas
- Open Graph + Twitter Cards
- Schema.org structured data
- Sitemap automático (futuro)

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Crie .dev.vars na raiz:
ANTHROPIC_API_KEY=sk-ant-api03-...

# 3. Desenvolvimento local
npm run dev

# 4. Build para produção
npm run build
```

## 📦 Deploy no Cloudflare Pages

### 1. Criar KV Namespaces

```bash
# Instalar Wrangler
npm install -g wrangler

# Login
wrangler login

# Criar namespaces
wrangler kv:namespace create "GUIDES_KV"
wrangler kv:namespace create "GUIDES_KV" --preview
wrangler kv:namespace create "METADATA_KV"
wrangler kv:namespace create "METADATA_KV" --preview
```

### 2. Atualizar wrangler.toml

Substitua os IDs no arquivo `wrangler.toml` pelos IDs gerados.

### 3. Deploy

**Via GitHub (Recomendado):**
1. Push para GitHub
2. Conecte no Cloudflare Pages
3. Configure:
   - Build command: `npm run build`
   - Build output: `dist`
   - Environment variables: `ANTHROPIC_API_KEY`
4. Adicione KV bindings no dashboard

**Via CLI:**
```bash
wrangler pages deploy dist --project-name=guia-games-br
```

## 📁 Estrutura do Projeto

```
guia-games-br/
├── functions/              # Cloudflare Functions
│   ├── api/
│   │   ├── generate-content.ts
│   │   └── get-guide/[slug].ts
│   └── config/
│       └── prompts.ts
├── src/
│   ├── components/
│   │   └── SearchBar.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── Guide.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── contentDetection.ts
│   │   ├── slugify.ts
│   │   └── seo.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── wrangler.toml
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🔑 Variáveis de Ambiente

### Obrigatórias
- `ANTHROPIC_API_KEY` - API key da Anthropic Claude

### Opcionais
- `UNSPLASH_ACCESS_KEY` - Para imagens (futuro)

## 💰 Custos Estimados

- **Cloudflare Pages**: Grátis (até 500 builds/mês)
- **Cloudflare KV**: Grátis (até 100k reads/dia)
- **Claude API**: ~$0.05-0.10 por guia gerado
- **Total**: ~$15-50/mês dependendo do volume

## 🎯 Exemplos de Uso

```typescript
// Busca que gera códigos
"códigos free fire"
→ Detecta: tipo='codigos', game='free fire'

// Busca que gera tutorial
"como jogar de mago mobile legends"
→ Detecta: tipo='tutorial', game='mobile legends'

// Busca que gera tier list
"tier list personagens genshin impact"
→ Detecta: tipo='tierlist', game='genshin impact'

// Busca que gera build
"build yasuo wild rift"
→ Detecta: tipo='build', game='wild rift'
```

## 🛠️ Desenvolvimento

### Comandos Úteis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

### TypeScript

O projeto usa TypeScript strict mode. Todos os tipos estão em `src/types/index.ts`.

## 📊 API Endpoints

### POST /api/generate-content
Gera novo guia ou retorna do cache.

**Request:**
```json
{
  "query": "códigos free fire",
  "forceRegenerate": false
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* GuideData */ },
  "cached": false,
  "slug": "codigos-free-fire"
}
```

### GET /api/get-guide/:slug
Recupera guia existente.

**Response:**
```json
{
  "success": true,
  "data": { /* GuideData */ }
}
```

## 🔒 Segurança

- API keys apenas no backend (Cloudflare Secrets)
- Rate limiting configurado
- CORS restrito ao domínio
- Validação de inputs
- Sanitização de HTML

## 📈 Próximos Passos

- [ ] Integração com Unsplash API para imagens
- [ ] Sistema de busca avançado
- [ ] Painel admin
- [ ] Sitemap dinâmico
- [ ] Analytics (Google Analytics 4)
- [ ] Monetização (AdSense)

## 📝 Licença

MIT License

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou PR.

---

**Desenvolvido com ❤️ para a comunidade gamer brasileira**
