# Claude — interface (3 telas)

Clone da interface do app Claude em português, com as 3 telas da foto:

1. **Início** — estrela, “Boa tarde, Muri”, Chat com Claude, Sonnet 5 Médio
2. **Menu** — os **3 tracinhos** abrem a barra do canto (Conversas, Projetos, Código, Artefatos)
3. **Configurações** — o botão **MS** abre Perfil, Cobrança, Notificações, etc.

Repositório público: https://github.com/murilosilvadacosta5ano-dotcom/claude-app

## Como usar

- Clique nos **3 tracinhos** (☰) no canto superior esquerdo → abre a barra lateral
- Clique em **MS** (iniciais) no rodapé da barra → abre Configurações
- Clique em **+ Novo bate-papo** → volta para o início

## Abrir sem instalar (HTML único)

Abra o arquivo [`site-claude.html`](./site-claude.html) no navegador. Tem as 3 telas e os cliques do menu / MS.

## Rodar o app React

```bash
git clone https://github.com/murilosilvadacosta5ano-dotcom/claude-app.git
cd claude-app
npm install
npm run dev
```

Abre em `http://localhost:8080`.

## Arquivos principais

| Parte | Arquivo |
|---|---|
| Tela inicial | `src/components/home-view.tsx` |
| Compositor (Chat com Claude) | `src/components/composer.tsx` |
| Ícones e estrela | `src/components/claude-mark.tsx` |
| Barra do canto | `src/components/sidebar.tsx` |
| Configurações | `src/components/settings.tsx` |
| App (junta tudo) | `src/components/claude-app.tsx` |
| Chat | `src/components/chat-view.tsx` |
| Conversas / Projetos / Código / Artefatos | `src/components/views.tsx` |
| Estado (menu aberto, MS, conversas) | `src/lib/store.ts` |
| Estilos | `src/styles.css` |
| HTML único (3 telas) | `site-claude.html` |

Conta de exemplo: **Muri** (`murilosilva.dacosta12@gmail.com`).
