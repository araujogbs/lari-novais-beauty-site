# Prévia visual — anotações (out/2026)

Teste de visual feito na branch **`previa-visual`** do repositório do site. **Nada disso está publicado**: a branch `master` (que publica na Cloudflare) continua igual. Para ver a prévia, rode o site local (`npm run dev`) com a branch `previa-visual` e abra http://localhost:5173. Use o botão de sol/lua do menu para comparar o modo diurno e o noturno.

**Status (26/10/2026):** visual aprovado pela Lari ("agora tá perfeito"), aguardando o momento de publicar. Cada item abaixo diz onde mexer para voltar só ele, caso mude de ideia.

Quase todo o CSS novo está no fim de `src/styles/main.css`, em blocos comentados ("PRÉVIA VISUAL", "Moldura celeste", "TEMA CELESTE NO SITE TODO").

---

## 1. Fonte dos títulos

- **Decisão final (26/10):** a Lari preferiu o traço fino, então ficou a **Cormorant Garamond** de antes, em todo o site e no painel. A troca para EB Garamond foi desfeita.
- **Ponto conhecido:** a Cormorant desenha o "ê" e o "ô" com o acento um pouco acima da letra ("você", "Referências"). Isso é do desenho da fonte (testado no Google Fonts e no fontsource) e foi aceito.
- **Onde:** link da fonte em `index.html`; nome da fonte em `src/styles/main.css` e `src/painel/painel.css`.

## 2. Topo da página (hero)

- **O quê:** no desktop, texto e botões à esquerda e a foto oval à direita, com os três botões numa linha e visíveis sem rolar. A fase da lua continua embaixo (veja também o item 18, tela cheia). No celular segue igual, só "São Paulo" não quebra mais no meio.
- **Onde:** `src/components/Hero.tsx` (texto envolvido em `hero-text`) e o bloco "Item 2: hero lado a lado" no CSS.

## 3. Contraste

- **O quê:** os números 01–06 do "Como funciona" (antes quase invisíveis) e as legendas das constelações ("A constelação da artista") ficaram legíveis.

## 4. Depoimentos

- **O quê:** três cartões inteiros no desktop (antes o terceiro aparecia cortado). Cartões com borda fina do tema e aspas grandes e suaves no canto.

## 5. Faixas de cor entre seções

- **O quê:** as faixas rosa (dia) e azul mais claro (noite) entram e saem em degradê, sem linha reta. Quando duas faixas rosa ficam seguidas, o rosa continua direto, sem faixa branca no meio (regra mantida no CSS, embora hoje, sem a seção Serviços, não haja mais duas seguidas na home).

## 6. Cartão de valores do Social ("carta celeste")

- **O quê:**
  - Título "Valores" com ornamento "— ✦ —" (antes repetia "Maquiagem + Penteado R$ 700").
  - Cada linha: nome na fonte serifada, duração embaixo em letra pequena e pontilhado até o preço, como um menu fino.
  - Preços sem centavos ("R$ 380").
  - O pacote ganhou faixa com brilho, selo "✦ Pacote · economize R$ 60" e preço maior.
- **Onde:** lista `PRICES` em `src/components/SocialService.tsx`. **Atenção:** se mudar preço ou duração no banco, mudar aqui também.

## 7. Moldura celeste (borda fina dupla com estrelinhas nos cantos)

- **Onde aparece:**
  - Cartão de valores do Social.
  - Pacote de noivas ("O que está incluso"), com estrelinhas ✦ no lugar dos ✓.
  - Agendamento.
  - Formulário de noivas.
  - Formulário do "Fale comigo".
  - Cartões de WhatsApp, e-mail e redes (estes sem as estrelinhas dos cantos).
- **Cores:** estrelas e moldura douradas no modo noturno, rosa no diurno.
- **Onde:** componente `src/components/StarCorners.tsx` (estrelas dos cantos e ornamento do título) e a classe `frame` no CSS.

## 8. Agendamento em constelação

- **O quê:**
  - As etapas 1 a 4 viraram estrelas ligadas por uma linha pontilhada vertical.
  - A caixinha de marcar o serviço virou uma estrela que acende e cresce quando marcada; o serviço escolhido ganha borda e brilho.
  - Nomes, preços, total e o botão "Adicionar outro cliente" na fonte serifada.
  - No celular, as abas "Novo agendamento" e "Meus agendamentos" cabem numa linha.

## 9. Formulários (noivas e "Fale comigo")

- **O quê:** campos mais leves com borda fina, brilho suave ao clicar para digitar e rótulos entre estrelinhas (✦ Mensagem ✦) no de noivas.

## 10. Divisores e rótulos das seções

- **O quê:** o tracinho abaixo dos títulos virou "— ✦ —"; os rótulos ganharam estrelinhas dos lados (✦ DEPOIMENTOS ✦).

## 11. "Como funciona" das noivas

- **O quê:** os números 01–06 viraram estrelas num círculo (com brilho à noite), ligadas por linha pontilhada em cada fileira. No celular a linha só aparece no espaço entre um cartão e o próximo.

## 12. Fotos em arco

- **O quê:** "Referências visuais" (noivas) e a galeria do Social com o topo em arco, ecoando a foto oval do topo. Ao passar o mouse a foto sobe um pouco com brilho; nas fotos de noivas aparece uma estrelinha piscando.

## 13. Cursos

- **O quê:** emojis 📅 👥 trocados por ícones de linha rosa (relógio, pessoas, etiqueta do valor), sem quebrar "4 horas" no meio. Botões "Quero me inscrever" alinhados no pé dos três cartões e com o mesmo brilho dourado do botão rosa.
- **Onde:** ícones no topo de `src/components/Courses.tsx`.

## 14. Redes

- **O quê:** logos reais do Instagram, YouTube e TikTok (antes ★ ▶ ♫) num círculo, na cor do site, seguindo o modo diurno/noturno. Corrigido "Vinculado às redes" (faltava a crase).
- **Onde:** `src/components/Networks.tsx`.

## 15. Botões e detalhes finos

- **O quê:**
  - Botões de contorno com a borda fina do tema. O brilho dourado do botão rosa já existia e foi mantido.
  - Ornamento "— ✦ —" discreto acima do nome no rodapé (continua clean).
  - Texto selecionado na cor do tema.

## 16. Espaçamento

- **Antes:** 224px de vazio entre a maioria das seções no desktop (112 em cima + 112 embaixo), com exceções soltas (152, 64, 80, 240px). O topo ocupava a tela inteira e deixava um vão grande entre a fase da lua e os cartões.
- **Agora:**
  - **Desktop:** 160px entre todas as seções; seções que continuam a anterior (depoimentos, redes, fale comigo) ficam mais coladas.
  - **Celular:** espaçamento menor (56px), com compensação nas seções que têm o desenho da constelação acima do título.
  - **Topo:** primeiro foi encolhido; depois voltou a ocupar a tela inteira de forma organizada (item 18, versão final).
- **Onde:** bloco "Espaçamento: escala única" no fim do CSS.

## 17. Home sem repetição

- **O quê:** a seção "Serviços / O que eu posso fazer por você?" (cartões com foto, texto e "Saiba mais") saiu, porque repetia os cartões Noivas / Eventos Sociais / Cursos. Nova ordem: topo, "Olá, eu sou a Lari", cartões Noivas / Eventos Sociais / Cursos (que já levam para cada seção) e depois depoimentos.
- **Onde:** ordem em `src/App.tsx`; o componente `ServicesHome.tsx` foi apagado (dá para recuperar pelo git).

## 18. Home em tela cheia

- **O quê:** no desktop a home ocupa a altura da tela, com texto e foto centralizados e a fase da lua no pé; o "Sobre" só aparece ao rolar. Título sempre em duas linhas (antes quebrava em três em telas largas) e foto um pouco maior. No celular segue igual.
- **Onde:** bloco "A home ocupa a tela inteira" no fim do CSS (este bloco substitui o ajuste do item 16 que encolhia o topo).

## Como a home ficou (ordem final)

1. Topo em tela cheia: título, botões, foto oval e fase da lua
2. "Olá, eu sou a Lari"
3. Cartões Noivas / Eventos Sociais / Cursos (cada um leva à sua seção)
4. Depoimentos
5. Sobre mim, Noivas, Social (valores + agendamento), Cursos, Redes, Fale comigo e rodapé

---

## O que ficou de fora, por escolha

- **Menu:** sem mudanças.
- **Mantidos:** as estrelas animadas do fundo, as 4 fotos do Sobre e o rodapé (só o ornamento).
- **Página única:** continua tudo numa página, navegada pelos botões do menu.

## Roteiro para publicar

1. Abrir a prévia uma última vez nos dois modos (sol/lua) e no celular.
2. Conferir se os valores do cartão do Social (`PRICES` em `SocialService.tsx`) batem com os do sistema.
3. Juntar a branch: `git checkout master && git merge previa-visual`.
4. Rodar `npm run check` (tipos, lint, formatação e testes).
5. `git push origin master`: a Cloudflare publica sozinha em 1 a 2 minutos.
6. Abrir larinovaisbeauty.com.br e conferir (pode precisar de Ctrl+F5 para limpar o cache).

Para voltar tudo depois de publicado: `git revert` dos commits abaixo (ou do merge) e push.

## Commits da prévia (branch `previa-visual`)

1. `625c3ab` — fonte, hero, contraste, depoimentos inteiros, faixas em degradê, selo nos valores, ícones dos cursos, logos das redes
2. `9e5fb96` — moldura celeste nos valores, no pacote de noivas e no agendamento; etapas em constelação
3. `04bd417` — formulário de noivas na moldura celeste
4. `2a85a6c` — faixas rosa seguidas sem branco no meio
5. `109250b` — tema celeste no site todo (divisores, como funciona, depoimentos, fotos em arco, botões, Fale comigo, rodapé)
6. `50354ec` — espaçamento revisado
7. `9f59807` — seção Serviços removida, Sobre a Lari sobe
8. `db6ba13` — home em tela cheia
9. `aa90979` — volta a fonte fina e aviso de horários especiais
