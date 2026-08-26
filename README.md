# Claude — interface (3 telas)

Clone da interface do app Claude em português, com as 3 telas da foto:

1. **Início** — estrela, “Boa tarde, Muri”, Chat com Claude, Sonnet 5 Médio  
2. **Menu** — os **3 tracinhos** abrem a barra do canto (Conversas, Projetos, Código, Artefatos)  
3. **Configurações** — o botão **MS** abre Perfil, Cobrança, Notificações, etc.

## Como usar

- Clique nos **3 tracinhos** (☰) no canto superior esquerdo → abre a barra lateral  
- Clique em **MS** (iniciais) no rodapé da barra → abre Configurações  
- Clique em **+ Novo bate-papo** → volta para o início

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

Conta de exemplo: **Muri** (`murilosilva.dacosta12@gmail.com`).
