# Lari Novais Beauty — Site

Site institucional de uma maquiadora e penteadista profissional que atende a domicílio (São Paulo). Apresenta a profissional, os serviços de **noivas**, **atendimento social** e **cursos**, reúne depoimentos de clientes e converte visitas em contato por **WhatsApp**. O Atendimento Social tem **agendamento online** integrado à [AgendamentoApi](../../AgendamentoAPI/README.md).

- **Tipo:** site de uma página (one-page) em **React + TypeScript**, com build e servidor de desenvolvimento do **Vite**.
- **Fontes:** Cormorant Garamond e Inter (Google Fonts).
- **Conteúdo:** segue o documento `INFORMAÇÕES SITE.docx`, que é a referência de textos, preços e estrutura.

---

## Sumário

1. [Estrutura do projeto](#estrutura-do-projeto)
2. [Seções do site](#seções-do-site)
3. [Formulários e WhatsApp](#formulários-e-whatsapp)
4. [Agendamento online (Atendimento Social)](#agendamento-online-atendimento-social)
5. [Como rodar localmente](#como-rodar-localmente)
6. [Configuração](#configuração)
7. [Como editar o conteúdo](#como-editar-o-conteúdo)
8. [Publicação](#publicação)
9. [Limitações conhecidas e próximos passos](#limitações-conhecidas-e-próximos-passos)

---

## Estrutura do projeto

```
larinovais beauty/
├── index.html                 # Só o <head> e o <div id="root">
├── src/
│   ├── main.tsx               # Ponto de entrada (StrictMode + CSS)
│   ├── App.tsx                # Monta as seções na ordem da página
│   ├── components/            # Uma seção por componente (Hero, AboutMe, Brides, Courses…)
│   │   ├── Nav.tsx · HeroCarousel.tsx · ReviewsCarousel.tsx   # partes interativas
│   │   └── BrideForm.tsx · ContactForm.tsx                    # formulários -> WhatsApp
│   ├── agendamento/           # Widget de agendamento online (Atendimento Social)
│   │   ├── AgendamentoWidget.tsx   # abas e estado geral
│   │   ├── NewBooking.tsx          # passos 1-4 e envio
│   │   ├── MyAppointments.tsx      # consulta e cancelamento por telefone
│   │   ├── BookingDone.tsx         # tela de confirmação
│   │   ├── booking.ts              # validação, regras de fotos e montagem do multipart (puro)
│   │   ├── api.ts · types.ts       # chamadas à AgendamentoApi e tipos
│   │   └── useAsync.ts · useServices.ts   # hooks de busca
│   ├── data/                  # Conteúdo em dados: depoimentos, fotos do hero, links do menu
│   ├── hooks/useReveal.ts     # Animação de entrada (.reveal)
│   ├── whatsapp.ts            # Montagem das mensagens e links do WhatsApp
│   ├── config.ts · utils.ts   # Variáveis VITE_* e utilitários (máscaras, datas, valores)
│   ├── styles/main.css        # Todos os estilos
│   └── **/*.test.ts(x)        # Testes (Vitest + Testing Library)
├── public/fotos/              # Imagens (Lari, Noivas, Atendimento Social, Fotos modelos)
├── .env.example               # Modelo das variáveis de ambiente
├── package.json · tsconfig.json · vite.config.ts
├── eslint.config.js · .prettierrc.json · .editorconfig
├── INFORMAÇÕES SITE.docx      # Documento de conteúdo (fonte dos textos)
└── README.md
```

Os arquivos de `public/` são copiados como estão para o `dist/` e referenciados por `/fotos/...` no HTML.

---

## Seções do site

A navegação fixa no topo tem: **Home · Sobre Mim · Noivas · Social · Cursos · Redes · Depoimentos · Fale Comigo**. No celular vira menu hambúrguer.

| Seção | Âncora | O que tem |
|---|---|---|
| **Home** | `#home` | Hero com carrossel automático de fotos (troca a cada 4 s), chamada principal e botões. Em seguida: portfólio em 3 blocos (Noivas, Eventos Sociais, Cursos), apresentação "Olá, eu sou a Lari" (sem o título "Quem sou eu"), cartões de serviços |
| **Depoimentos** | `#depoimentos` | Carrossel com as 7 avaliações reais do documento. **Só existe na Home** |
| **Sobre Mim** | `#sobre` | "A artista por trás dos pincéis": trajetória em texto e currículo (Senac, Anhembi Morumbi, Style Academy, Visagismo, O Poder da Juba e especializações) |
| **Noivas** | `#noivas` | Frase de posicionamento, "Do primeiro contato ao altar" em 6 passos, galeria de inspirações, pacote único ("a partir de R$ 3.000,00") e formulário da noiva |
| **Atendimento Social** | `#social` | Texto de posicionamento, galeria, tabela de preços, **agendamento online** e carrossel "Avaliações no Google" |
| **Cursos** | `#cursos` | Três cursos Beauty Class (Automaquiagem, Penteado Profissional, Maquiagem Profissional), cada um com botão "Quero me Inscrever" que abre o WhatsApp |
| **Redes** | `#redes` | Instagram, TikTok e YouTube, com os links reais |
| **Fale Comigo** | `#contato` | Formulário de sugestões, elogios e parcerias, mais WhatsApp, e-mail e redes |

### Conteúdo oculto
- **Equipe:** a seção completa (`#equipe`) e o bloco "Redes" da Home estão com o atributo `hidden`, e o link "Equipe" saiu do menu. Para exibir de novo, remova `hidden` da `<section>` correspondente.
- **Depoimentos de noivas e de clientes sociais:** removidos de propósito. Está previsto gravar vídeos curtos de depoimento no futuro.

### Preços (Atendimento Social)
| Item | Valor |
|---|---|
| Pacote Maquiagem e Penteado | R$ 550,00 |
| Maquiagem (unitário) | R$ 290,00 |
| Penteado (unitário) | R$ 290,00 |
| Escova/Babyliss | R$ 250,00 |

A taxa de deslocamento é cobrada à parte, conforme o endereço. Há condições especiais para agendamentos de segunda a quinta, das 8h às 18h. Cursos: Automaquiagem R$ 500,00 (4 h); Penteado Profissional (20 h) e Maquiagem Profissional (6 h) com valores sob consulta.

---

## Formulários e WhatsApp

Todos os contatos usam o número **(11) 91483-4786** (`5511914834786` nos links `wa.me`). Os formulários não enviam dados a nenhum servidor: montam uma mensagem formatada e abrem o WhatsApp da visitante com o texto pronto.

| Formulário | Campos | Componente |
|---|---|---|
| **Noivas** ("Quero ser sua noiva") | Nome da noiva, data do casamento, local do evento, mensagem | `BrideForm.tsx` |
| **Fale Comigo** | Nome, e-mail, assunto (Sugestão, Elogio, Parceria, Outro), mensagem | `ContactForm.tsx` |
| **Cursos** | Sem formulário: o botão abre o WhatsApp com "Quero me inscrever no curso …" | link direto |

Os valores digitados são enviados pela URL com `encodeURIComponent`. Datas saem em formato dd/mm/aaaa. A montagem das mensagens fica em `src/whatsapp.ts` (com testes). O e-mail de contato exibido é `contato.larinovaisbeauty@gmail.com`.

---

## Agendamento online (Atendimento Social)

O widget (`src/agendamento/`) conversa com a **AgendamentoApi** (.NET). Noivas **não** usa agendamento online, apenas o formulário de WhatsApp.

**Fluxo da cliente**
1. Escolhe o **serviço** (lista, duração e preço vêm de `GET /api/services`).
2. Escolhe a **data**; os **horários livres** vêm de `GET /api/appointments/available-slots`.
3. Preenche nome, WhatsApp (com máscara), horário em que precisa estar pronta, CEP, número, quantidade de pessoas, descrição e **fotos de referência** (até 5, JPG/PNG/WebP, 5 MB cada, com miniaturas e botão para remover).
4. Ao completar o **CEP**, o endereço é preenchido e a **taxa de deslocamento** é calculada (`GET /api/appointments/estimate-fee`). O resumo mostra serviço, deslocamento e total.
5. Confirma (`POST /api/appointments`, formulário multipart). O horário é enviado em fuso de Brasília (`-03:00`).
6. Em **Meus agendamentos**, busca pelo WhatsApp e cancela com mais de 24 h de antecedência (`my-appointments` e `client-cancel`).

O horário escolhido é o de **estar pronta** (`readyTime`); a API calcula o início voltando a duração total (serviço × pessoas). A quantidade de pessoas (`people`) multiplica o valor do serviço e a duração, mas não o deslocamento.

**Se a API estiver indisponível:** o widget mostra um aviso e um link "Agendar pelo WhatsApp"; o resto do site não é afetado.

**Regras que vêm do backend** (não do site): expediente das 6h às 22h, sem sobreposição de horários, cancelamento só com mais de 24 h, limites de requisições por IP (resposta 429) e cálculo de deslocamento a partir do CEP. Detalhes no README da AgendamentoApi.

### Serviços cadastrados na API (ambiente local)
| Id | Serviço | Duração | Preço |
|---|---|---|---|
| 1 | Maquiagem | 60 min | R$ 350 |
| 2 | Penteado | 90 min (site mostra 60 a 90) | R$ 350 |
| 3 | Maquiagem + Penteado | 150 min | R$ 700 |
| 4 | Escova e Babyliss | 60 min | R$ 300 |

Aplicado pela migration `AtualizarServicosSocial` da API (`dotnet ef database update`).

As durações são estimativas e devem ser ajustadas ao tempo real de atendimento. Esses registros foram criados direto no banco local; em produção é preciso cadastrá-los de novo.

---

## Como rodar localmente

### Só o site
Requer Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # checagem de tipos (strict)
npm run lint       # ESLint (typescript-eslint strict)
npm run format     # Prettier
npm test           # testes (Vitest)
npm run check      # typecheck + lint + format + testes
npm run build      # gera dist/ (tsc + vite build)
npm run preview    # serve o dist/ localmente
```

Sem a API no ar, o site funciona normalmente, só o widget de agendamento mostra o aviso de indisponibilidade.

### Com o agendamento
1. Suba o PostgreSQL e a API (veja o README da AgendamentoApi):
   ```bash
   cd ../../AgendamentoAPI/AgendamentoApi
   dotnet run --launch-profile http   # http://localhost:5102
   ```
2. Confirme que `VITE_AGENDAMENTO_API` (em `.env.development`) aponta para `http://localhost:5102/api`.
3. Rode `npm run dev` e vá até o Atendimento Social.

Em desenvolvimento a API aceita qualquer origem (CORS aberto). Em produção só aceita as origens listadas em `Cors:AllowedOrigins`.

---

## Configuração

Variáveis de ambiente do Vite (modelo em `.env.example`; `npm run dev` lê o `.env.development`; **`npm run build` lê o `.env.production`**, que você precisa criar, senão o widget sai como "indisponível"):

```
VITE_AGENDAMENTO_API=https://api.seudominio.com/api   # URL pública (HTTPS) da AgendamentoApi
VITE_WHATSAPP=5511914834786                            # WhatsApp dos formulários e do plano B do widget
```

As variáveis são embutidas no build: ao mudá-las, rode `npm run build` de novo. Os links `wa.me` escritos direto em `src/components/Courses.tsx` (botões de curso) continuam com o número fixo; para trocar de número, faça uma busca e substituição nesse arquivo.

---

## Como editar o conteúdo

- **Textos:** edite o componente da seção em `src/components/` (por exemplo, a Trajetória está em `AboutMe.tsx`). Ele é JSX: `class` vira `className` e `style` é um objeto.
- **Depoimentos e avaliações:** ficam em `src/data/reviews.ts`. O mesmo conteúdo alimenta o carrossel da Home e o do Google. Para as avaliações do Google serem reais, será preciso integrar com a API do Google Places ou copiar os textos manualmente.
- **Cursos:** cada curso é um bloco `.curso-card` em `src/components/Courses.tsx`; o link do botão é um `wa.me` com o nome do curso já codificado.
- **Fotos:** coloque as imagens em `public/fotos/` e referencie por `/fotos/...`. Atenção ao peso (veja abaixo).
- **Cores e tipografia:** variáveis CSS em `:root` no topo de `src/styles/main.css` (`--rose`, `--rose-dark`, `--cream`…).
- **Preços do Social:** estão em dois lugares, no cartão de preços de `src/components/SocialService.tsx` e nos serviços da API. Atualize os dois.

---

## Publicação

O site é estático: rode `npm run build` e publique o conteúdo da pasta `dist/` em qualquer hospedagem de arquivos (Netlify, Vercel, GitHub Pages, Cloudflare Pages, hospedagem comum).

Antes de publicar:
1. Hospedar a **AgendamentoApi com HTTPS** e definir `VITE_AGENDAMENTO_API` com a URL pública antes do build. Páginas HTTPS não conseguem chamar uma API HTTP.
2. Colocar o domínio do site em `Cors:AllowedOrigins` na API.
3. Cadastrar na API os serviços do Social (tabela acima).
4. **Otimizar as fotos.** A pasta `fotos/` pesa cerca de **145 MB**, com muitos JPGs originais de câmera. Convém redimensionar (por exemplo, 1600 px no lado maior) e comprimir, ou converter para WebP, para o site carregar rápido no celular.
5. Revisar os links ainda vazios ou de exemplo.

---

## Limitações conhecidas e próximos passos

- **Fotos pesadas** (145 MB) e sem versões responsivas (`srcset`) nem carregamento preguiçoso (`loading="lazy"`).
- **Avaliações do Google são simuladas:** os 7 textos vêm do documento, e o selo "5,0" foi definido manualmente. Não há integração com o Google.
- **Seção Equipe e bloco de redes da Home estão ocultos**; os nomes e descrições da Equipe são de exemplo.
- **Cartões de Instagram e TikTok** na seção Redes trazem listas de exemplo ("Antes e depois de noivas", "Penteado em 60 segundos") que não vêm do documento.
- **Conteúdo do portfólio** da Home e rótulos das fotos são genéricos; vale revisar com a cliente.
- **Horário de atendimento da API é fixo** (6h às 22h, constantes `WorkStart`/`WorkEnd` no `AppointmentsController`).
- **Fuso:** o widget envia o horário com `-03:00` fixo, o que está correto enquanto o Brasil não adotar horário de verão.
- **"Meus agendamentos" usa só o telefone** como identificação (limitação da API).
- **Sem analytics, SEO avançado ou metadados de compartilhamento** (Open Graph, favicon, `sitemap`). Há apenas `title` e `lang`.
- **Acessibilidade:** o menu e os carrosséis precisam de revisão (foco por teclado, textos alternativos mais descritivos, contraste dos rótulos rosa claro).
- Ideias: vídeos curtos de depoimento, blog, integração real com o Google Reviews, lembretes de agendamento.
