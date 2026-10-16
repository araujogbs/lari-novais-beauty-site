/* Widget de agendamento do Atendimento Social.
   Conversa com a AgendamentoApi (.NET). A URL base vem de VITE_AGENDAMENTO_API. */
import { API_URL } from '../config';
import { brl, digits, esc, fmtDateBR, fmtWhen, maskCep, maskPhone, must, todayISO, waLink } from '../utils';
import * as api from './api';
import { ApiError } from './api';
import type { WidgetState } from './types';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

const freshState = (services: WidgetState['services'] = []): WidgetState => ({
  services,
  service: null,
  date: '',
  slot: '',
  fee: null,
  files: [],
  busy: false,
});

export function initAgendamento(): void {
  const root = document.getElementById('agendaApp');
  if (!root) return;
  const app: HTMLElement = root;

  let st = freshState();

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- T é o ponto de asserção de tipo do DOM
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => must<T>(app, sel);
  const input = (sel: string) => $<HTMLInputElement>(sel);

  /* ---------- estrutura ---------- */
  function build(): void {
    app.innerHTML =
      '<div class="ag-tabs">' +
      '<button type="button" class="ag-tab active" data-tab="novo">Novo agendamento</button>' +
      '<button type="button" class="ag-tab" data-tab="meus">Meus agendamentos</button>' +
      '</div>' +
      '<div class="ag-panel" id="agNovo">' +
      '<div class="ag-step"><h4><span>1</span> Escolha o serviço</h4><div class="ag-services" id="agServices"><p class="ag-hint">Carregando serviços…</p></div></div>' +
      '<div class="ag-step"><h4><span>2</span> Dia e horário</h4>' +
      '<div class="form-group"><label>Data do evento</label><input type="date" id="agDate"></div>' +
      '<div class="ag-slots" id="agSlots"><p class="ag-hint">Escolha o serviço e a data para ver os horários livres.</p></div></div>' +
      '<div class="ag-step"><h4><span>3</span> Seus dados</h4>' +
      '<div class="ag-grid">' +
      '<div class="form-group ag-full"><label>Seu nome completo</label><input type="text" id="agNome" autocomplete="name"></div>' +
      '<div class="form-group"><label>WhatsApp</label><input type="tel" id="agFone" placeholder="(11) 91234-5678" autocomplete="tel"></div>' +
      '<div class="form-group"><label>Horário que precisa estar pronta</label><input type="time" id="agPronta"></div>' +
      '<div class="form-group"><label>CEP do atendimento</label><input type="text" id="agCep" inputmode="numeric" placeholder="00000-000"></div>' +
      '<div class="form-group"><label>Número / complemento</label><input type="text" id="agNum" placeholder="Ex.: 120, apto 32"></div>' +
      '<div class="form-group ag-full"><label>Endereço</label><input type="text" id="agEnd" placeholder="Preenchido pelo CEP"></div>' +
      '<div class="form-group ag-full ag-fee" id="agFee" hidden></div>' +
      '<div class="form-group"><label>Quantas pessoas irão se arrumar</label><input type="number" id="agQtd" min="1" max="20" value="1"></div>' +
      '<div class="form-group ag-full"><label>Fotos de referência (até 5, opcional)</label><input type="file" id="agFotos" accept="image/jpeg,image/png,image/webp" multiple><div class="ag-thumbs" id="agThumbs"></div></div>' +
      '<div class="form-group ag-full"><label>Como você quer a sua produção?</label><textarea id="agMsg" rows="3" placeholder="Conte o tipo de evento, o estilo de make e de penteado que você imagina…"></textarea></div>' +
      '</div></div>' +
      '<div class="ag-step"><h4><span>4</span> Confirmação</h4>' +
      '<div class="ag-summary" id="agSummary"><p class="ag-hint">O resumo aparece aqui.</p></div>' +
      '<p class="ag-msg" id="agErro" role="alert" hidden></p>' +
      '<button type="button" class="btn btn-primary ag-submit" id="agEnviar">Confirmar agendamento</button>' +
      '<p class="ag-alt">Prefere conversar? <a href="' +
      waLink() +
      '" target="_blank" rel="noopener">Agendar pelo WhatsApp</a></p>' +
      '</div>' +
      '</div>' +
      '<div class="ag-panel" id="agMeus" hidden>' +
      '<p class="ag-hint">Digite o WhatsApp usado no agendamento para ver seus horários futuros.</p>' +
      '<div class="ag-lookup"><input type="tel" id="agBuscaFone" placeholder="(11) 91234-5678"><button type="button" class="btn btn-primary" id="agBuscar">Buscar</button></div>' +
      '<p class="ag-msg" id="agBuscaErro" hidden></p>' +
      '<div id="agLista"></div>' +
      '</div>';

    input('#agDate').min = todayISO();
    bind();
  }

  /* ---------- eventos ---------- */
  function bind(): void {
    app.querySelectorAll<HTMLButtonElement>('.ag-tab').forEach((b) => {
      b.addEventListener('click', () => showTab(b.dataset.tab ?? 'novo'));
    });
    input('#agDate').addEventListener('change', (e) => {
      st.date = (e.target as HTMLInputElement).value;
      void loadSlots();
    });
    input('#agFone').addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      el.value = maskPhone(el.value);
      renderSummary();
    });
    input('#agBuscaFone').addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      el.value = maskPhone(el.value);
    });
    input('#agCep').addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      el.value = maskCep(el.value);
      if (digits(el.value).length === 8) void estimateFee();
      else {
        st.fee = null;
        renderFee();
        renderSummary();
      }
    });
    ['#agNome', '#agPronta', '#agNum', '#agEnd', '#agQtd', '#agMsg'].forEach((s) => {
      $(s).addEventListener('input', renderSummary);
    });
    input('#agFotos').addEventListener('change', onFiles);
    $('#agEnviar').addEventListener('click', () => void submit());
    $('#agBuscar').addEventListener('click', () => void lookup());
  }

  function showTab(t: string): void {
    app.querySelectorAll<HTMLButtonElement>('.ag-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === t);
    });
    $('#agNovo').hidden = t !== 'novo';
    $('#agMeus').hidden = t !== 'meus';
  }

  /* ---------- serviços ---------- */
  async function loadServices(): Promise<void> {
    try {
      const list = await api.getServices();
      st.services = (list ?? []).filter((s) => s.isActive !== false);
      const box = $('#agServices');
      if (!st.services.length) {
        box.innerHTML = '<p class="ag-hint">Nenhum serviço disponível no momento.</p>';
        return;
      }
      box.innerHTML = st.services
        .map(
          (s) =>
            `<label class="ag-service"><input type="radio" name="agServico" value="${s.id}">` +
            `<span class="ag-service-name">${esc(s.name)}</span>` +
            `<span class="ag-service-meta">${Math.round(s.durationMinutes)} min</span>` +
            `<span class="ag-service-price">${brl(s.price)}</span></label>`,
        )
        .join('');
      box.querySelectorAll<HTMLInputElement>('input').forEach((r) => {
        r.addEventListener('change', () => {
          st.service = st.services.find((s) => String(s.id) === r.value) ?? null;
          st.slot = '';
          void loadSlots();
          renderSummary();
        });
      });
    } catch {
      $('#agServices').innerHTML =
        `<p class="ag-msg">Não foi possível carregar os serviços agora. <a href="${waLink()}" target="_blank" rel="noopener">Agende pelo WhatsApp</a>.</p>`;
      $<HTMLButtonElement>('#agEnviar').disabled = true;
    }
  }

  /* ---------- horários ---------- */
  async function loadSlots(): Promise<void> {
    const box = $('#agSlots');
    st.slot = '';
    const service = st.service;

    if (!service || !st.date) {
      box.innerHTML = '<p class="ag-hint">Escolha o serviço e a data para ver os horários livres.</p>';
      renderSummary();
      return;
    }
    box.innerHTML = '<p class="ag-hint">Buscando horários…</p>';
    renderSummary();
    const reqKey = `${service.id}|${st.date}`;
    const current = () => (st.service ? `${st.service.id}|${st.date}` : '');
    try {
      const slots = await api.getSlots(st.date, service.id);
      if (reqKey !== current()) return; // resposta de uma escolha anterior
      if (!slots?.length) {
        box.innerHTML = '<p class="ag-hint">Sem horários livres nesse dia. Tente outra data.</p>';
        return;
      }
      box.innerHTML = slots
        .map((h) => `<button type="button" class="ag-slot" data-h="${esc(h)}">${esc(h)}</button>`)
        .join('');
      box.querySelectorAll<HTMLButtonElement>('.ag-slot').forEach((b) => {
        b.addEventListener('click', () => {
          box.querySelectorAll('.ag-slot').forEach((x) => x.classList.remove('active'));
          b.classList.add('active');
          st.slot = b.dataset.h ?? '';
          renderSummary();
        });
      });
    } catch (e) {
      box.innerHTML = `<p class="ag-msg">${esc(errMsg(e))}</p>`;
    }
  }

  /* ---------- CEP / deslocamento ---------- */
  async function estimateFee(): Promise<void> {
    const cep = digits(input('#agCep').value);
    const fee = $('#agFee');
    fee.hidden = false;
    fee.textContent = 'Calculando deslocamento…';
    try {
      const r = await api.estimateFee(cep);
      if (digits(input('#agCep').value) !== cep) return; // CEP mudou durante a consulta
      st.fee = r;
      renderFee();
      const end = input('#agEnd');
      if (!end.value && r.street) end.value = [r.street, r.neighborhood, r.city].filter(Boolean).join(', ');
    } catch (e) {
      st.fee = null;
      fee.hidden = false;
      fee.textContent = errMsg(e);
    }
    renderSummary();
  }

  function renderFee(): void {
    const fee = $('#agFee');
    if (!st.fee) {
      fee.hidden = true;
      fee.textContent = '';
      return;
    }
    fee.hidden = false;
    fee.textContent =
      st.fee.travelFee > 0
        ? `Distância até o ateliê: ${st.fee.distanceKm.toFixed(1).replace('.', ',')} km · taxa de deslocamento (ida e volta): ${brl(st.fee.travelFee)}`
        : 'Deslocamento gratuito para o seu endereço.';
  }

  /* ---------- fotos ---------- */
  function onFiles(e: Event): void {
    const el = e.target as HTMLInputElement;
    const novos = Array.from(el.files ?? []);
    el.value = ''; // permite escolher mais fotos (ou a mesma de novo) em seguida
    let erro = '';
    for (const f of novos) {
      if (erro) break;
      if (!ACCEPTED_TYPES.includes(f.type)) erro = 'Use fotos JPG, PNG ou WebP.';
      else if (f.size > MAX_FILE_BYTES) erro = 'Cada foto deve ter até 5 MB.';
      else if (st.files.length >= MAX_FILES) erro = 'Envie no máximo 5 fotos.';
      else st.files.push(f);
    }
    renderThumbs();
    if (erro) showErr(erro);
    else $('#agErro').hidden = true;
    renderSummary();
  }

  function renderThumbs(): void {
    const box = $('#agThumbs');
    box.querySelectorAll('img').forEach((i) => URL.revokeObjectURL(i.src));
    box.innerHTML = '';
    st.files.forEach((f, i) => {
      const w = document.createElement('div');
      w.className = 'ag-thumb';
      const img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      img.alt = `Foto de referência ${i + 1}`;
      const x = document.createElement('button');
      x.type = 'button';
      x.setAttribute('aria-label', 'Remover foto');
      x.textContent = '×';
      x.addEventListener('click', () => {
        st.files.splice(i, 1);
        renderThumbs();
        renderSummary();
      });
      w.append(img, x);
      box.appendChild(w);
    });
    if (st.files.length) {
      const c = document.createElement('span');
      c.className = 'ag-hint';
      c.textContent = `${st.files.length}/${MAX_FILES} fotos`;
      box.appendChild(c);
    }
  }

  function showErr(m: string): void {
    const e = $('#agErro');
    e.textContent = m;
    e.hidden = false;
    e.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------- resumo ---------- */
  const total = (): number => (st.service?.price ?? 0) + (st.fee?.travelFee ?? 0);

  function renderSummary(): void {
    const box = $('#agSummary');
    const s = st.service;
    if (!s) {
      box.innerHTML = '<p class="ag-hint">O resumo aparece aqui.</p>';
      return;
    }
    const rows: [string, string][] = [
      ['Serviço', s.name],
      ['Data', fmtDateBR(st.date) || '—'],
      ['Horário', st.slot || '—'],
    ];
    let html = rows.map(([k, v]) => `<div><span>${k}</span><strong>${esc(v)}</strong></div>`).join('');
    html += `<div><span>Valor do serviço</span><strong>${brl(s.price)}</strong></div>`;
    if (st.fee)
      html += `<div><span>Deslocamento</span><strong>${st.fee.travelFee > 0 ? brl(st.fee.travelFee) : 'Gratuito'}</strong></div>`;
    html += `<div class="ag-total"><span>Total</span><strong>${brl(total())}</strong></div>`;
    box.innerHTML = html;
  }

  /* ---------- envio ---------- */
  async function submit(): Promise<void> {
    if (st.busy) return;
    const nome = input('#agNome').value.trim();
    const fone = input('#agFone').value.trim();
    const pronta = input('#agPronta').value;
    const cep = digits(input('#agCep').value);
    const num = input('#agNum').value.trim();
    const end = input('#agEnd').value.trim();
    const qtd = parseInt(input('#agQtd').value, 10) || 1;
    const msg = $<HTMLTextAreaElement>('#agMsg').value.trim();
    const service = st.service;

    const firstError = (): string | null => {
      if (!service) return 'Escolha o serviço.';
      if (!st.date || !st.slot) return 'Escolha a data e o horário.';
      if (!nome) return 'Informe o seu nome completo.';
      if (digits(fone).length < 10) return 'Informe um WhatsApp válido com DDD.';
      if (!pronta) return 'Informe o horário em que precisa estar pronta.';
      if (!end && !cep) return 'Informe o CEP ou o endereço do atendimento.';
      if (!msg) return 'Conte como você quer a sua produção.';
      return null;
    };

    const invalid = firstError();
    if (invalid || !service) {
      showErr(invalid ?? 'Escolha o serviço.');
      return;
    }

    const endereco = [end, num].filter(Boolean).join(', ') + (cep ? ` — CEP ${maskCep(cep)}` : '');
    const descricao = `Atendimento Social. Pronta às ${pronta}. Pessoas a se arrumar: ${qtd}.\n${msg}`;

    const fd = new FormData();
    fd.append('clientName', nome);
    fd.append('clientPhone', fone);
    fd.append('clientAddress', endereco);
    if (cep.length === 8) fd.append('cep', cep);
    fd.append('description', descricao);
    fd.append('serviceItemId', String(service.id));
    fd.append('startTime', `${st.date}T${st.slot}:00-03:00`); // horário de Brasília
    st.files.forEach((f) => fd.append('images', f));

    st.busy = true;
    const btn = $<HTMLButtonElement>('#agEnviar');
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    $('#agErro').hidden = true;

    try {
      await api.createAppointment(fd);
      done(nome, fone);
      return;
    } catch (e) {
      const status = e instanceof ApiError ? e.status : 0;
      showErr(
        status === 409
          ? `${errMsg(e)} Escolha outro horário.`
          : errMsg(e) || 'Não foi possível concluir o agendamento.',
      );
      if (status === 409) void loadSlots();
    }
    st.busy = false;
    btn.disabled = false;
    btn.textContent = 'Confirmar agendamento';
  }

  function done(nome: string, fone: string): void {
    const s = st.service;
    if (!s) return;
    const when = `${fmtDateBR(st.date)} às ${st.slot}`;
    app.innerHTML =
      '<div class="ag-done">' +
      '<div class="ag-check">&#10003;</div>' +
      '<h3>Agendamento confirmado!</h3>' +
      `<p>${esc(nome.split(' ')[0])}, seu horário está reservado.</p>` +
      `<div class="ag-summary"><div><span>Serviço</span><strong>${esc(s.name)}</strong></div>` +
      `<div><span>Quando</span><strong>${esc(when)}</strong></div>` +
      `<div class="ag-total"><span>Total</span><strong>${brl(total())}</strong></div></div>` +
      '<p class="ag-hint">Você receberá a confirmação pelo WhatsApp. Para ver ou cancelar (com mais de 24 h de antecedência), use "Meus agendamentos".</p>' +
      '<button type="button" class="btn btn-primary" id="agVer">Ver meus agendamentos</button>' +
      '</div>';
    $('#agVer').addEventListener('click', () => {
      st = freshState(st.services);
      build();
      void loadServices();
      showTab('meus');
      input('#agBuscaFone').value = fone;
      void lookup();
    });
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- meus agendamentos ---------- */
  async function cancel(id: string, fone: string, err: HTMLElement): Promise<void> {
    try {
      await api.cancelAppointment(id, fone);
      await lookup();
    } catch (e) {
      err.textContent = errMsg(e);
      err.hidden = false;
    }
  }

  async function lookup(): Promise<void> {
    const fone = input('#agBuscaFone').value;
    const err = $('#agBuscaErro');
    const lista = $('#agLista');
    err.hidden = true;
    if (digits(fone).length < 10) {
      err.textContent = 'Informe um WhatsApp válido.';
      err.hidden = false;
      return;
    }
    lista.innerHTML = '<p class="ag-hint">Buscando…</p>';
    try {
      const items = await api.getMyAppointments(fone);
      if (!items?.length) {
        lista.innerHTML = '<p class="ag-hint">Nenhum agendamento futuro encontrado para este número.</p>';
        return;
      }
      lista.innerHTML = items
        .map(
          (a) =>
            `<div class="ag-appt"><div><strong>${esc(a.serviceName)}</strong><span>${esc(fmtWhen(a.startTime))}</span>` +
            (a.clientAddress ? `<span>${esc(a.clientAddress)}</span>` : '') +
            `</div><button type="button" class="btn btn-outline" data-id="${esc(a.id)}">Cancelar</button></div>`,
        )
        .join('');
      lista.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((b) => {
        b.addEventListener('click', () => {
          if (!confirm('Cancelar este agendamento?')) return;
          void cancel(b.dataset.id ?? '', fone, err);
        });
      });
    } catch (e) {
      lista.innerHTML = '';
      err.textContent = errMsg(e);
      err.hidden = false;
    }
  }

  if (!API_URL) {
    app.innerHTML = `<p class="ag-msg">Agendamento online indisponível. <a href="${waLink()}" target="_blank" rel="noopener">Agende pelo WhatsApp</a>.</p>`;
    return;
  }
  build();
  void loadServices();
}
