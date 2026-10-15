/* Widget de agendamento do Atendimento Social.
   Conversa com a AgendamentoApi (.NET). A URL base vem de window.AGENDAMENTO_API (definida no index.html). */
(function () {
  var API = (window.AGENDAMENTO_API || '').replace(/\/$/, '');
  var WA = window.AGENDAMENTO_WA || '5511914834786';
  var root = document.getElementById('agendaApp');
  if (!root) return;

  var st = { services: [], service: null, date: '', slot: '', fee: null, files: [], busy: false };

  function $(sel) { return root.querySelector(sel); }
  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
  function brl(n) { return 'R$ ' + Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function digits(v) { return (v || '').replace(/\D/g, ''); }
  function fmtDateBR(iso) { return iso ? iso.split('-').reverse().join('/') : ''; }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fmtWhen(iso) {
    if (!/[zZ]|[+-]\d\d:?\d\d$/.test(iso)) iso += 'Z';
    return new Date(iso).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }
  function maskPhone(v) {
    var d = digits(v).slice(0, 11);
    if (d.length <= 2) return d ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  function maskCep(v) { var d = digits(v).slice(0, 8); return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; }

  function api(path, opts) {
    return fetch(API + path, opts).then(function (r) {
      return r.text().then(function (txt) {
        var data = null;
        try { data = txt ? JSON.parse(txt) : null; } catch (e) { /* corpo não-JSON */ }
        if (!r.ok) {
          var msg = (data && data.message) || (r.status === 429 ? 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' : 'Algo deu errado (' + r.status + ').');
          var err = new Error(msg); err.status = r.status; throw err;
        }
        return data;
      });
    });
  }

  function waFallback(text) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text || 'Olá, vim pelo site e gostaria de agendar um atendimento social.');
  }

  /* ---------- estrutura ---------- */
  function build() {
    root.innerHTML =
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
          '<p class="ag-alt">Prefere conversar? <a href="' + waFallback() + '" target="_blank" rel="noopener">Agendar pelo WhatsApp</a></p>' +
        '</div>' +
      '</div>' +
      '<div class="ag-panel" id="agMeus" hidden>' +
        '<p class="ag-hint">Digite o WhatsApp usado no agendamento para ver seus horários futuros.</p>' +
        '<div class="ag-lookup"><input type="tel" id="agBuscaFone" placeholder="(11) 91234-5678"><button type="button" class="btn btn-primary" id="agBuscar">Buscar</button></div>' +
        '<p class="ag-msg" id="agBuscaErro" hidden></p>' +
        '<div id="agLista"></div>' +
      '</div>';

    var date = $('#agDate'); date.min = todayISO();
    bind();
  }

  /* ---------- eventos ---------- */
  function bind() {
    root.querySelectorAll('.ag-tab').forEach(function (b) {
      b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
    });
    $('#agDate').addEventListener('change', function (e) { st.date = e.target.value; loadSlots(); });
    $('#agFone').addEventListener('input', function (e) { e.target.value = maskPhone(e.target.value); renderSummary(); });
    $('#agBuscaFone').addEventListener('input', function (e) { e.target.value = maskPhone(e.target.value); });
    $('#agCep').addEventListener('input', function (e) {
      e.target.value = maskCep(e.target.value);
      if (digits(e.target.value).length === 8) estimateFee(); else { st.fee = null; renderFee(); renderSummary(); }
    });
    ['#agNome', '#agPronta', '#agNum', '#agEnd', '#agQtd', '#agMsg'].forEach(function (s) {
      $(s).addEventListener('input', renderSummary);
    });
    $('#agFotos').addEventListener('change', onFiles);
    $('#agEnviar').addEventListener('click', submit);
    $('#agBuscar').addEventListener('click', lookup);
  }

  function showTab(t) {
    root.querySelectorAll('.ag-tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === t); });
    $('#agNovo').hidden = t !== 'novo';
    $('#agMeus').hidden = t !== 'meus';
  }

  /* ---------- serviços ---------- */
  function loadServices() {
    api('/services').then(function (list) {
      st.services = (list || []).filter(function (s) { return s.isActive !== false; });
      var box = $('#agServices');
      if (!st.services.length) { box.innerHTML = '<p class="ag-hint">Nenhum serviço disponível no momento.</p>'; return; }
      box.innerHTML = st.services.map(function (s) {
        return '<label class="ag-service"><input type="radio" name="agServico" value="' + s.id + '">' +
          '<span class="ag-service-name">' + esc(s.name) + '</span>' +
          '<span class="ag-service-meta">' + Math.round(s.durationMinutes) + ' min</span>' +
          '<span class="ag-service-price">' + brl(s.price) + '</span></label>';
      }).join('');
      box.querySelectorAll('input').forEach(function (r) {
        r.addEventListener('change', function () {
          st.service = st.services.filter(function (s) { return String(s.id) === r.value; })[0];
          st.slot = ''; loadSlots(); renderSummary();
        });
      });
    }).catch(function () {
      $('#agServices').innerHTML = '<p class="ag-msg">Não foi possível carregar os serviços agora. ' +
        '<a href="' + waFallback() + '" target="_blank" rel="noopener">Agende pelo WhatsApp</a>.</p>';
      $('#agEnviar').disabled = true;
    });
  }

  /* ---------- horários ---------- */
  function loadSlots() {
    var box = $('#agSlots'); st.slot = '';
    if (!st.service || !st.date) { box.innerHTML = '<p class="ag-hint">Escolha o serviço e a data para ver os horários livres.</p>'; renderSummary(); return; }
    box.innerHTML = '<p class="ag-hint">Buscando horários…</p>';
    var reqKey = st.service.id + '|' + st.date;
    api('/appointments/available-slots?date=' + st.date + '&serviceId=' + st.service.id).then(function (slots) {
      if (reqKey !== st.service.id + '|' + st.date) return;
      if (!slots || !slots.length) { box.innerHTML = '<p class="ag-hint">Sem horários livres nesse dia. Tente outra data.</p>'; return; }
      box.innerHTML = slots.map(function (h) { return '<button type="button" class="ag-slot" data-h="' + esc(h) + '">' + esc(h) + '</button>'; }).join('');
      box.querySelectorAll('.ag-slot').forEach(function (b) {
        b.addEventListener('click', function () {
          box.querySelectorAll('.ag-slot').forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active'); st.slot = b.getAttribute('data-h'); renderSummary();
        });
      });
    }).catch(function (e) { box.innerHTML = '<p class="ag-msg">' + esc(e.message) + '</p>'; });
    renderSummary();
  }

  /* ---------- CEP / deslocamento ---------- */
  function estimateFee() {
    var cep = digits($('#agCep').value);
    var fee = $('#agFee'); fee.hidden = false; fee.textContent = 'Calculando deslocamento…';
    api('/appointments/estimate-fee?cep=' + cep).then(function (r) {
      st.fee = r; renderFee();
      var end = $('#agEnd');
      if (!end.value && r.street) end.value = [r.street, r.neighborhood, r.city].filter(Boolean).join(', ');
      renderSummary();
    }).catch(function (e) { st.fee = null; fee.hidden = false; fee.textContent = e.message; renderSummary(); });
  }
  function renderFee() {
    var fee = $('#agFee');
    if (!st.fee) { fee.hidden = true; fee.textContent = ''; return; }
    fee.hidden = false;
    fee.textContent = st.fee.travelFee > 0
      ? 'Distância até o ateliê: ' + Number(st.fee.distanceKm).toFixed(1).replace('.', ',') + ' km · taxa de deslocamento (ida e volta): ' + brl(st.fee.travelFee)
      : 'Deslocamento gratuito para o seu endereço.';
  }

  /* ---------- fotos ---------- */
  function onFiles(e) {
    var novos = Array.prototype.slice.call(e.target.files);
    e.target.value = ''; // permite escolher mais fotos (ou a mesma de novo) em seguida
    var ok = ['image/jpeg', 'image/png', 'image/webp'];
    var erro = '';
    novos.forEach(function (f) {
      if (erro) return;
      if (ok.indexOf(f.type) < 0) erro = 'Use fotos JPG, PNG ou WebP.';
      else if (f.size > 5 * 1024 * 1024) erro = 'Cada foto deve ter até 5 MB.';
      else if (st.files.length >= 5) erro = 'Envie no máximo 5 fotos.';
      else st.files.push(f);
    });
    renderThumbs();
    if (erro) showErr(erro); else $('#agErro').hidden = true;
    renderSummary();
  }

  function renderThumbs() {
    var box = $('#agThumbs');
    box.querySelectorAll('img').forEach(function (i) { URL.revokeObjectURL(i.src); });
    box.innerHTML = '';
    st.files.forEach(function (f, i) {
      var w = document.createElement('div'); w.className = 'ag-thumb';
      var img = document.createElement('img'); img.src = URL.createObjectURL(f); img.alt = 'Foto de referência ' + (i + 1);
      var x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Remover foto'); x.textContent = '×';
      x.addEventListener('click', function () { st.files.splice(i, 1); renderThumbs(); renderSummary(); });
      w.appendChild(img); w.appendChild(x); box.appendChild(w);
    });
    if (st.files.length) { var c = document.createElement('span'); c.className = 'ag-hint'; c.textContent = st.files.length + '/5 fotos'; box.appendChild(c); }
  }

  function showErr(m) { var e = $('#agErro'); e.textContent = m; e.hidden = false; e.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

  /* ---------- resumo ---------- */
  function total() { return (st.service ? Number(st.service.price) : 0) + (st.fee ? Number(st.fee.travelFee || 0) : 0); }
  function renderSummary() {
    var box = $('#agSummary');
    if (!st.service) { box.innerHTML = '<p class="ag-hint">O resumo aparece aqui.</p>'; return; }
    var rows = [['Serviço', st.service.name], ['Data', fmtDateBR(st.date) || '—'], ['Horário', st.slot || '—']];
    var html = rows.map(function (r) { return '<div><span>' + r[0] + '</span><strong>' + esc(r[1]) + '</strong></div>'; }).join('');
    html += '<div><span>Valor do serviço</span><strong>' + brl(st.service.price) + '</strong></div>';
    if (st.fee) html += '<div><span>Deslocamento</span><strong>' + (st.fee.travelFee > 0 ? brl(st.fee.travelFee) : 'Gratuito') + '</strong></div>';
    html += '<div class="ag-total"><span>Total</span><strong>' + brl(total()) + '</strong></div>';
    box.innerHTML = html;
  }

  /* ---------- envio ---------- */
  function submit() {
    if (st.busy) return;
    var nome = $('#agNome').value.trim(), fone = $('#agFone').value.trim(), pronta = $('#agPronta').value,
        cep = digits($('#agCep').value), num = $('#agNum').value.trim(), end = $('#agEnd').value.trim(),
        qtd = parseInt($('#agQtd').value, 10) || 1, msg = $('#agMsg').value.trim();
    if (!st.service) return showErr('Escolha o serviço.');
    if (!st.date || !st.slot) return showErr('Escolha a data e o horário.');
    if (!nome) return showErr('Informe o seu nome completo.');
    if (digits(fone).length < 10) return showErr('Informe um WhatsApp válido com DDD.');
    if (!pronta) return showErr('Informe o horário em que precisa estar pronta.');
    if (!end && !cep) return showErr('Informe o CEP ou o endereço do atendimento.');
    if (!msg) return showErr('Conte como você quer a sua produção.');

    var endereco = [end, num].filter(Boolean).join(', ') + (cep ? ' — CEP ' + maskCep(cep) : '');
    var descricao = 'Atendimento Social. Pronta às ' + pronta + '. Pessoas a se arrumar: ' + qtd + '.\n' + msg;

    var fd = new FormData();
    fd.append('clientName', nome);
    fd.append('clientPhone', fone);
    fd.append('clientAddress', endereco);
    if (cep.length === 8) fd.append('cep', cep);
    fd.append('description', descricao);
    fd.append('serviceItemId', st.service.id);
    fd.append('startTime', st.date + 'T' + st.slot + ':00-03:00'); // horário de Brasília
    st.files.forEach(function (f) { fd.append('images', f); });

    st.busy = true;
    var btn = $('#agEnviar'); btn.disabled = true; btn.textContent = 'Enviando…'; $('#agErro').hidden = true;

    api('/appointments', { method: 'POST', body: fd }).then(function () {
      done(nome, fone);
    }).catch(function (e) {
      showErr(e.status === 409 ? e.message + ' Escolha outro horário.' : (e.message || 'Não foi possível concluir o agendamento.'));
      if (e.status === 409) loadSlots();
    }).then(function () {
      st.busy = false; btn.disabled = false; btn.textContent = 'Confirmar agendamento';
    });
  }

  function done(nome, fone) {
    var s = st.service, when = fmtDateBR(st.date) + ' às ' + st.slot, t = total();
    root.innerHTML =
      '<div class="ag-done">' +
        '<div class="ag-check">&#10003;</div>' +
        '<h3>Agendamento confirmado!</h3>' +
        '<p>' + esc(nome.split(' ')[0]) + ', seu horário está reservado.</p>' +
        '<div class="ag-summary"><div><span>Serviço</span><strong>' + esc(s.name) + '</strong></div>' +
        '<div><span>Quando</span><strong>' + esc(when) + '</strong></div>' +
        '<div class="ag-total"><span>Total</span><strong>' + brl(t) + '</strong></div></div>' +
        '<p class="ag-hint">Você receberá a confirmação pelo WhatsApp. Para ver ou cancelar (com mais de 24 h de antecedência), use "Meus agendamentos".</p>' +
        '<button type="button" class="btn btn-primary" id="agVer">Ver meus agendamentos</button>' +
      '</div>';
    $('#agVer').addEventListener('click', function () {
      st = { services: st.services, service: null, date: '', slot: '', fee: null, files: [], busy: false };
      build(); loadServices(); showTab('meus');
      $('#agBuscaFone').value = fone; lookup();
    });
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- meus agendamentos ---------- */
  function lookup() {
    var fone = $('#agBuscaFone').value, err = $('#agBuscaErro'), lista = $('#agLista');
    err.hidden = true;
    if (digits(fone).length < 10) { err.textContent = 'Informe um WhatsApp válido.'; err.hidden = false; return; }
    lista.innerHTML = '<p class="ag-hint">Buscando…</p>';
    api('/appointments/my-appointments?phone=' + encodeURIComponent(fone)).then(function (items) {
      if (!items || !items.length) { lista.innerHTML = '<p class="ag-hint">Nenhum agendamento futuro encontrado para este número.</p>'; return; }
      lista.innerHTML = items.map(function (a) {
        return '<div class="ag-appt"><div><strong>' + esc(a.serviceName) + '</strong><span>' + esc(fmtWhen(a.startTime)) + '</span>' +
          (a.clientAddress ? '<span>' + esc(a.clientAddress) + '</span>' : '') + '</div>' +
          '<button type="button" class="btn btn-outline" data-id="' + a.id + '">Cancelar</button></div>';
      }).join('');
      lista.querySelectorAll('button[data-id]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (!confirm('Cancelar este agendamento?')) return;
          api('/appointments/' + b.getAttribute('data-id') + '/client-cancel', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: fone })
          }).then(lookup).catch(function (e) { err.textContent = e.message; err.hidden = false; });
        });
      });
    }).catch(function (e) { lista.innerHTML = ''; err.textContent = e.message; err.hidden = false; });
  }

  if (!API) { root.innerHTML = '<p class="ag-msg">Agendamento online indisponível. <a href="' + waFallback() + '" target="_blank" rel="noopener">Agende pelo WhatsApp</a>.</p>'; return; }
  build();
  loadServices();
})();
