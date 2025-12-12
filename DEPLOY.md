# 📦 Guia Completo de Deploy - Guia Games BR

Este guia vai te levar do zero ao deploy completo no Cloudflare Pages.

## ✅ Pré-requisitos

- [ ] Conta no [Cloudflare](https://dash.cloudflare.com/sign-up)
- [ ] Conta no [Anthropic](https://console.anthropic.com)
- [ ] Conta no [GitHub](https://github.com) (opcional, mas recomendado)
- [ ] Node.js 18+ instalado
- [ ] Git instalado

## 🔑 Passo 1: Obter API Key da Anthropic

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Faça login ou crie uma conta
3. Clique em **API Keys** no menu lateral
4. Clique em **Create Key**
5. Dê um nome (ex: "Guia Games BR")
6. **IMPORTANTE**: Copie a chave e salve em local seguro (ela só aparece uma vez!)

**Formato da chave**: `sk-ant-api03-...`

**Custo**: A API é paga. Preços em [anthropic.com/pricing](https://www.anthropic.com/pricing)
- Claude Sonnet 4: ~$3 por milhão de tokens de entrada, ~$15 por milhão de tokens de saída
- Estimativa: ~$0.05-0.10 por guia gerado

## 🗂️ Passo 2: Preparar o Projeto

### 2.1 Configurar Variáveis Locais (Opcional)

Para testar localmente:

```bash
# Copie o arquivo de exemplo
cp .dev.vars.example .dev.vars

# Edite e adicione sua chave
# ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 2.2 Testar Localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` e teste a interface.

**Nota**: As funções do Cloudflare não funcionarão localmente sem configuração adicional.

## 📤 Passo 3: Subir para o GitHub

### 3.1 Criar Repositório

1. Acesse [github.com/new](https://github.com/new)
2. Nome: `guia-games-br` (ou outro de sua escolha)
3. Deixe como **Private** (recomendado) ou **Public**
4. **NÃO** adicione README, .gitignore ou licença (já temos)
5. Clique em **Create repository**

### 3.2 Fazer Push

```bash
# Inicialize o git (se ainda não fez)
git init

# Adicione todos os arquivos
git add .

# Faça o commit inicial
git commit -m "Initial commit - Guia Games BR"

# Adicione o remote (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/guia-games-br.git

# Faça o push
git branch -M main
git push -u origin main
```

## ☁️ Passo 4: Criar KV Namespace no Cloudflare

### 4.1 Instalar Wrangler

```bash
npm install -g wrangler
```

### 4.2 Fazer Login

```bash
wrangler login
```

Isso abrirá o navegador para você autorizar.

### 4.3 Criar KV Namespaces

```bash
# Namespace de produção
wrangler kv:namespace create "GUIDES_KV"

# Namespace de preview
wrangler kv:namespace create "GUIDES_KV" --preview
```

**Anote os IDs retornados!** Exemplo:

```
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "GUIDES_KV", id = "abc123def456" }
```

### 4.4 Atualizar wrangler.toml

Edite o arquivo `wrangler.toml` e substitua os IDs:

```toml
[[kv_namespaces]]
binding = "GUIDES_KV"
id = "SEU_ID_AQUI"              # ← Cole o ID de produção
preview_id = "SEU_PREVIEW_ID"   # ← Cole o ID de preview
```

**Faça commit das alterações:**

```bash
git add wrangler.toml
git commit -m "Update KV namespace IDs"
git push
```

## 🚀 Passo 5: Deploy no Cloudflare Pages

### 5.1 Criar Projeto

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Vá em **Workers & Pages** > **Create application**
3. Clique na aba **Pages**
4. Clique em **Connect to Git**

### 5.2 Conectar GitHub

1. Clique em **Connect GitHub**
2. Autorize o Cloudflare
3. Selecione seu repositório `guia-games-br`
4. Clique em **Begin setup**

### 5.3 Configurar Build

**Project name**: `guia-games-br` (ou outro nome)

**Production branch**: `main`

**Build settings**:
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (deixe vazio)

**Environment variables** (clique em "Add variable"):
- **Variable name**: `ANTHROPIC_API_KEY`
- **Value**: `sk-ant-api03-...` (sua chave)

Clique em **Save and Deploy**

### 5.4 Aguardar Build

O Cloudflare vai:
1. Clonar seu repositório
2. Instalar dependências
3. Fazer o build
4. Fazer o deploy

Isso leva ~2-3 minutos.

## 🔗 Passo 6: Configurar KV Bindings

**IMPORTANTE**: Após o primeiro deploy, você precisa configurar o KV binding.

1. No painel do projeto, vá em **Settings** > **Functions**
2. Role até **KV namespace bindings**
3. Clique em **Add binding**
4. Configure:
   - **Variable name**: `GUIDES_KV`
   - **KV namespace**: Selecione o namespace que você criou
5. Clique em **Save**

**Faça um novo deploy** para aplicar as mudanças:

1. Vá em **Deployments**
2. Clique em **Retry deployment** no último deploy

OU faça um novo commit:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## ✅ Passo 7: Testar o Site

1. Acesse a URL fornecida pelo Cloudflare (ex: `guia-games-br.pages.dev`)
2. Teste a busca:
   - Digite "códigos free fire"
   - Clique em "Buscar"
   - Aguarde a geração do guia

Se tudo funcionou, parabéns! 🎉

## 🌐 Passo 8: Domínio Customizado (Opcional)

### 8.1 Adicionar Domínio

1. No painel do projeto, vá em **Custom domains**
2. Clique em **Set up a custom domain**
3. Digite seu domínio (ex: `guiagamesbr.com`)
4. Clique em **Continue**

### 8.2 Configurar DNS

O Cloudflare mostrará os registros DNS necessários:

**Se o domínio já está no Cloudflare:**
- Os registros serão adicionados automaticamente

**Se o domínio está em outro provedor:**
- Adicione os registros CNAME conforme instruído
- Aguarde a propagação DNS (pode levar até 24h)

## 🐛 Troubleshooting

### Erro: "Failed to build"

**Solução**:
```bash
# Limpe e reinstale localmente
rm -rf node_modules package-lock.json
npm install
npm run build

# Se funcionar, faça commit
git add package-lock.json
git commit -m "Fix dependencies"
git push
```

### Erro: "ANTHROPIC_API_KEY is not defined"

**Solução**:
1. Vá em **Settings** > **Environment variables**
2. Verifique se `ANTHROPIC_API_KEY` está configurada
3. Se não estiver, adicione
4. Faça um novo deploy

### Erro: "KV namespace not found"

**Solução**:
1. Verifique se o KV namespace foi criado: `wrangler kv:namespace list`
2. Vá em **Settings** > **Functions** > **KV namespace bindings**
3. Adicione o binding `GUIDES_KV`
4. Faça um novo deploy

### Erro: "Erro ao gerar guia" no site

**Possíveis causas**:
1. API Key inválida ou sem créditos
2. KV binding não configurado
3. Erro na API da Anthropic

**Debug**:
1. Vá em **Deployments** > clique no deploy > **View logs**
2. Procure por erros nas Functions
3. Verifique os logs em tempo real

### Site carrega mas busca não funciona

**Solução**:
1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Procure por erros
4. Verifique a aba **Network** ao fazer uma busca

## 📊 Monitoramento

### Ver Logs

1. Vá em **Deployments**
2. Clique no deployment ativo
3. Clique em **View logs**
4. Filtre por **Functions** para ver logs das APIs

### Analytics

1. Vá em **Analytics**
2. Veja métricas de:
   - Requests
   - Bandwidth
   - Errors
   - Performance

### Uso do KV

1. Vá em **Workers & Pages** > **KV**
2. Clique no seu namespace
3. Veja as chaves armazenadas
4. Você pode visualizar, editar ou deletar guias manualmente

## 💰 Custos Estimados

### Cloudflare Pages
- **Grátis** para até 500 builds/mês
- **Grátis** para bandwidth ilimitado
- **Grátis** para 100.000 requests/dia

### Cloudflare KV
- **Grátis** para até:
  - 100.000 leituras/dia
  - 1.000 escritas/dia
  - 1 GB de armazenamento

### Anthropic API
- **Pago** por uso
- Claude Sonnet 4: ~$0.05-0.10 por guia
- Estimativa para 1.000 guias/mês: ~$50-100

**Total**: Praticamente grátis até escalar bastante!

## 🔄 Atualizações Futuras

Para atualizar o site:

```bash
# Faça suas alterações
git add .
git commit -m "Descrição das mudanças"
git push
```

O Cloudflare fará o deploy automaticamente!

## 📞 Suporte

- **Cloudflare**: [community.cloudflare.com](https://community.cloudflare.com)
- **Anthropic**: [support.anthropic.com](https://support.anthropic.com)
- **Projeto**: Abra uma issue no GitHub

---

**Boa sorte com seu blog! 🚀🎮**
