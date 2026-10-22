import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { todayISO } from '../utils';
import { AgendamentoWidget } from './AgendamentoWidget';
import { addMonths, addMonthsToDate, monthOf } from './calendar';

/** Dia 10 do mês que vem: sempre no futuro e alcançado com um clique em "Próximo mês". */
const DAY = `${addMonths(monthOf(todayISO()), 1)}-10`;

/** Disponibilidade no formato da API: `slotsFor` decide quantos horários cada dia tem. */
function availabilityFor(url: string, slotsFor: (date: string) => number = () => 5): Response {
  const q = new URL(url, 'http://x').searchParams;
  const [y = 0, m = 1, d = 1] = (q.get('from') ?? '').split('-').map(Number);
  const days = Array.from({ length: Number(q.get('days')) }, (_, i) => {
    const date = new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10);
    return { date, slots: slotsFor(date) };
  });
  return json(days);
}

type Handler = (url: string, init?: RequestInit) => Response | undefined;

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

type Input = string | URL | Request;
const urlOf = (input: Input): string =>
  typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

const SERVICES = [
  { id: 1, name: 'Maquiagem', durationMinutes: 60, price: 290 },
  { id: 2, name: 'Penteado', durationMinutes: 90, price: 300 },
];

/** Simula a AgendamentoApi. `override` tem prioridade sobre as respostas padrão. */
function mockApi(override?: Handler) {
  const fetchMock = vi.fn((input: Input, init?: RequestInit) => {
    const url = urlOf(input);
    const custom = override?.(url, init);
    if (custom) return Promise.resolve(custom);
    let res = json(null, 404);
    if (url.endsWith('/services')) res = json(SERVICES);
    else if (url.includes('available-slots')) res = json(['09:00', '10:00']);
    else if (url.includes('/availability')) res = availabilityFor(url);
    else if (url.includes('estimate-fee'))
      res = json({ distanceKm: 12.34, travelFee: 40, street: 'Rua A', city: 'SP' });
    else if (url.endsWith('/appointments') && init?.method === 'POST') res = json({}, 201);
    else if (url.includes('my-appointments'))
      res = json([
        {
          id: 7,
          serviceName: 'Maquiagem',
          startTime: '2030-01-10T12:00:00Z',
          clientAddress: 'Rua A',
          status: 'Pending',
        },
      ]);
    else if (url.includes('client-cancel')) res = json({});
    return Promise.resolve(res);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const isPost = ([, init]: [Input, (RequestInit | undefined)?]): boolean => init?.method === 'POST';

async function fillValidForm(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.click(await screen.findByLabelText(/Maquiagem/));
  await user.click(screen.getByRole('button', { name: 'Próximo mês' }));
  await user.click(await screen.findByRole('button', { name: /, 10 de .*: livre$/ }));
  await user.click(await screen.findByRole('button', { name: '09:00' }));
  await user.type(screen.getByLabelText('Seu nome completo'), 'Maria Souza');
  await user.type(screen.getByLabelText('WhatsApp'), '11912345678');
  await user.type(screen.getByLabelText('CEP do atendimento'), '01310100');
  await user.type(screen.getByLabelText('Como você quer a sua produção?'), 'Casamento');
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('AgendamentoWidget', () => {
  it('conclui um agendamento completo e mostra a confirmação', async () => {
    const fetchMock = mockApi();
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await fillValidForm(user);

    // máscaras, endereço pelo CEP e total com deslocamento
    expect(screen.getByLabelText('WhatsApp')).toHaveValue('(11) 91234-5678');
    expect(screen.getByLabelText('CEP do atendimento')).toHaveValue('01310-100');
    expect(await screen.findByText(/12,3 km/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText('Endereço')).toHaveValue('Rua A, SP');
    });
    expect(screen.getByText('R$ 330,00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirmar agendamento' }));
    expect(await screen.findByText('Agendamento em análise')).toBeInTheDocument();
    expect(screen.getByText(/Maria, você receberá a confirmação pelo WhatsApp/)).toBeInTheDocument();
    expect(screen.getByText(/PIX do sinal/)).toBeInTheDocument();

    const post = fetchMock.mock.calls.find(isPost);
    const body = post?.[1]?.body;
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get('startTime')).toBe(`${DAY}T09:00:00-03:00`);
    expect((body as FormData).get('people')).toBe('1');
    expect((body as FormData).getAll('serviceItemIds')).toEqual(['1']);

    // links para salvar na agenda da cliente
    const google = screen.getByRole('link', { name: 'Google Agenda' });
    expect(google.getAttribute('href')).toContain(`dates=${DAY.replace(/-/g, '')}T090000`);
    expect(screen.getByRole('button', { name: 'Apple / Outlook' })).toBeInTheDocument();
  });

  it('permite marcar mais de um serviço e soma o valor', async () => {
    const fetchMock = mockApi();
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await fillValidForm(user);
    await user.click(screen.getByLabelText(/Penteado/));
    await user.click(await screen.findByRole('button', { name: '09:00' }));

    expect(screen.getByText('Maquiagem + Penteado')).toBeInTheDocument();
    expect(screen.getByText('R$ 590,00')).toBeInTheDocument();
    // os horários e a agenda são pedidos para a soma dos serviços
    expect(fetchMock.mock.calls.some(([u]) => urlOf(u).includes('serviceIds=1,2'))).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Confirmar agendamento' }));
    expect(await screen.findByText('Agendamento em análise')).toBeInTheDocument();
    const body = fetchMock.mock.calls.find(isPost)?.[1]?.body as FormData;
    expect(body.getAll('serviceItemIds')).toEqual(['1', '2']);
  });

  it('abre a agenda só até 3 meses à frente e avisa isso', async () => {
    mockApi();
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await user.click(await screen.findByLabelText(/Maquiagem/));
    expect(screen.getByText(/Agenda aberta até 3 meses à frente/)).toBeInTheDocument();

    const next = screen.getByRole('button', { name: 'Próximo mês' });
    for (let i = 0; i < 3; i++) await user.click(next);
    expect(next).toBeDisabled();

    const lastDay = addMonthsToDate(todayISO(), 3);
    const dayAfter = Number(lastDay.slice(8)) + 1;
    const after = screen.queryByRole('button', { name: new RegExp(`, ${dayAfter} de .*: agenda ainda não aberta$`) });
    // se o último dia for o fim do mês, não há dia seguinte nessa tela
    if (after) expect(after).toBeDisabled();
    expect(
      await screen.findByRole('button', { name: new RegExp(`, ${Number(lastDay.slice(8))} de .*: livre$`) }),
    ).toBeEnabled();
  });

  it('marca os dias lotados e não deixa escolhê-los', async () => {
    mockApi((url) => (url.includes('/availability') ? availabilityFor(url, (d) => (d === DAY ? 0 : 2)) : undefined));
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await user.click(await screen.findByLabelText(/Maquiagem/));
    await user.click(screen.getByRole('button', { name: 'Próximo mês' }));
    expect(await screen.findByRole('button', { name: /, 10 de .*: lotado$/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /, 11 de .*: últimos horários$/ })).toBeEnabled();
  });

  it('mostra erro de validação sem chamar a API de criação', async () => {
    const fetchMock = mockApi();
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await user.click(await screen.findByRole('button', { name: 'Confirmar agendamento' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Escolha o serviço.');
    expect(fetchMock.mock.calls.some(isPost)).toBe(false);
  });

  it('em conflito (409) mostra a mensagem e recarrega os horários', async () => {
    const fetchMock = mockApi((_url, init) =>
      init?.method === 'POST' ? json({ message: 'Horário indisponível.' }, 409) : undefined,
    );
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await fillValidForm(user);
    const slotCalls = (): number => fetchMock.mock.calls.filter(([u]) => urlOf(u).includes('available-slots')).length;
    const before = slotCalls();

    await user.click(screen.getByRole('button', { name: 'Confirmar agendamento' }));
    expect(await screen.findByText('Horário indisponível. Escolha outro horário.')).toBeInTheDocument();
    await waitFor(() => {
      expect(slotCalls()).toBe(before + 1);
    });
  });

  it('mostra o plano B pelo WhatsApp quando os serviços não carregam', async () => {
    mockApi((url) => (url.endsWith('/services') ? json({ message: 'erro' }, 500) : undefined));
    render(<AgendamentoWidget />);
    expect(await screen.findByText(/Não foi possível carregar os serviços/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar agendamento' })).toBeDisabled();
  });

  it('lista e cancela agendamentos pelo telefone', async () => {
    const fetchMock = mockApi();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await user.click(screen.getByRole('button', { name: 'Meus agendamentos' }));
    const panel = screen.getByLabelText('WhatsApp usado no agendamento').closest<HTMLElement>('.ag-panel');
    if (!panel) throw new Error('painel não encontrado');

    await user.type(within(panel).getByLabelText('WhatsApp usado no agendamento'), '11912345678');
    await user.click(within(panel).getByRole('button', { name: 'Buscar' }));
    expect(await within(panel).findByText('Maquiagem')).toBeInTheDocument();
    expect(within(panel).getByText('Em análise')).toBeInTheDocument();

    await user.click(within(panel).getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => {
      expect(fetchMock.mock.calls.some(([u]) => urlOf(u).includes('/7/client-cancel'))).toBe(true);
    });
  });

  it('valida o telefone antes de buscar', async () => {
    mockApi();
    const user = userEvent.setup();
    render(<AgendamentoWidget />);
    await user.click(screen.getByRole('button', { name: 'Meus agendamentos' }));
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByText('Informe um WhatsApp válido.')).toBeInTheDocument();
  });
});
