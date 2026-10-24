import { describe, expect, it } from 'vitest';
import {
  acceptFiles,
  buildAppointmentForm,
  durationLabel,
  EMPTY_VALUES,
  firstError,
  endTimeFor,
  fmtMinutes,
  groupsLabel,
  groupsParam,
  conflictsWith,
  plusMinutes,
  total,
} from './booking';
import type { BookingValues, Service } from './types';

const makeup: Service = { id: 1, name: 'Maquiagem', durationMinutes: 60, price: 380 };
const hair: Service = { id: 2, name: 'Penteado', durationMinutes: 90, price: 380 };
const service: Service = { id: 3, name: 'Escova e Babyliss', durationMinutes: 60, price: 300 };
const services = [[service]];
const pack: Service = { id: 4, name: 'Maquiagem + Penteado', durationMinutes: 150, price: 700 };
const valid: BookingValues = {
  nome: ' Maria Souza ',
  fone: '(11) 91234-5678',
  cep: '01310-100',
  num: '120, apto 32',
  end: 'Av. Paulista',
  msg: 'Casamento',
};
const file = (type: string, size = 10): File => new File([new Uint8Array(size)], 'x', { type });

describe('firstError', () => {
  it('valida na ordem dos passos', () => {
    expect(firstError(valid, [], '2030-01-10', '09:00')).toBe('Escolha o serviço.');
    expect(firstError(valid, [[service], []], '2030-01-10', '09:00')).toBe('Escolha o serviço de cada cliente.');
    expect(firstError(valid, services, '', '09:00')).toBe('Escolha a data e o horário.');
    expect(firstError(valid, services, '2030-01-10', '')).toBe('Escolha a data e o horário.');
    expect(firstError(EMPTY_VALUES, services, '2030-01-10', '09:00')).toBe('Informe o seu nome completo.');
    expect(firstError({ ...valid, fone: '1191' }, services, '2030-01-10', '09:00')).toBe(
      'Informe um WhatsApp válido com DDD.',
    );
    expect(firstError({ ...valid, cep: '', end: '' }, services, '2030-01-10', '09:00')).toBe(
      'Informe o CEP ou o endereço do atendimento.',
    );
    expect(firstError({ ...valid, msg: '  ' }, services, '2030-01-10', '09:00')).toBe(
      'Conte como você quer a sua produção.',
    );
  });

  it('retorna null quando tudo está preenchido', () => {
    expect(firstError(valid, services, '2030-01-10', '09:00')).toBeNull();
  });
});

describe('acceptFiles', () => {
  it('aceita imagens válidas', () => {
    expect(acceptFiles([], [file('image/png'), file('image/webp')]).error).toBe('');
  });

  it('rejeita tipo inválido, arquivo grande e excesso de fotos', () => {
    expect(acceptFiles([], [file('application/pdf')]).error).toBe('Use fotos JPG, PNG ou WebP.');
    expect(acceptFiles([], [file('image/png', 5 * 1024 * 1024 + 1)]).error).toBe('Cada foto deve ter até 5 MB.');
    const five = Array.from({ length: 5 }, () => file('image/png'));
    const r = acceptFiles(five, [file('image/png')]);
    expect(r.error).toBe('Envie no máximo 5 fotos.');
    expect(r.files).toHaveLength(5);
  });
});

describe('buildAppointmentForm', () => {
  it('monta o multipart com horário de Brasília e dados normalizados', () => {
    const fd = buildAppointmentForm(valid, services, '2030-01-10', '09:00', [file('image/png')]);
    expect(fd.get('clientName')).toBe('Maria Souza');
    expect(fd.get('clientAddress')).toBe('Av. Paulista, 120, apto 32 — CEP 01310-100');
    expect(fd.get('cep')).toBe('01310100');
    expect(fd.getAll('serviceItemIds')).toEqual(['3']);
    expect(fd.get('startTime')).toBe('2030-01-10T09:00:00-03:00');
    expect(fd.getAll('personServices')).toEqual(['3']);
    expect(fd.get('people')).toBe('1');
    expect(fd.get('description')).toBe('Atendimento Social.\nCasamento');
    expect(fd.getAll('images')).toHaveLength(1);
  });

  it('omite o CEP quando incompleto', () => {
    const fd = buildAppointmentForm({ ...valid, cep: '0131' }, services, '2030-01-10', '09:00', []);
    expect(fd.has('cep')).toBe(false);
  });
});

describe('total', () => {
  it('soma serviço e deslocamento', () => {
    expect(total(services, { distanceKm: 10, travelFee: 40 })).toBe(340);
    expect(total(services, undefined)).toBe(300);
    expect(total([], undefined)).toBe(0);
  });

  it('soma os serviços de cada pessoa, sem multiplicar o deslocamento', () => {
    // pessoa 1: maquiagem + penteado; pessoa 2: só penteado
    expect(total([[makeup, hair], [hair]], { distanceKm: 10, travelFee: 40 })).toBe(1180);
  });
});

describe('várias pessoas', () => {
  const groups = [[makeup, hair], [hair]];

  it('envia os serviços de cada pessoa', () => {
    const fd = buildAppointmentForm(valid, groups, '2030-01-10', '09:00', []);
    expect(fd.getAll('personServices')).toEqual(['1,2', '2']);
    expect(fd.getAll('serviceItemIds')).toEqual(['1', '2']);
    expect(fd.get('people')).toBe('2');
  });

  it('monta o parâmetro da API e o nome do pedido', () => {
    expect(groupsParam([[1, 2], [2]])).toBe('1,2;2');
    expect(groupsLabel(groups)).toBe('Cliente 1: Maquiagem + Penteado; Cliente 2: Penteado');
    expect(groupsLabel([[makeup], [makeup]])).toBe('Maquiagem');
  });

  it('o pacote não vale junto com maquiagem ou penteado avulsos', () => {
    expect(conflictsWith(pack, makeup)).toBe(true);
    expect(conflictsWith(hair, pack)).toBe(true);
    expect(conflictsWith(pack, service)).toBe(false);
    expect(conflictsWith(makeup, hair)).toBe(false);
  });
});

describe('durationLabel', () => {
  it('mostra 60 a 90 min para penteado avulso', () => {
    expect(durationLabel({ id: 1, name: 'Penteado', durationMinutes: 60, price: 350 })).toBe('60 a 90 min');
  });

  it('mantém a duração cadastrada nos demais serviços', () => {
    expect(durationLabel({ id: 2, name: 'Maquiagem', durationMinutes: 75, price: 350 })).toBe('75 min');
    expect(fmtMinutes(150)).toBe('2h30');
    expect(fmtMinutes(60)).toBe('1h');
    expect(fmtMinutes(45)).toBe('45 min');
    expect(durationLabel(pack)).toBe('120 a 150 min');
  });
});

describe('término previsto', () => {
  it('soma a duração de todas as pessoas ao horário de início', () => {
    expect(plusMinutes('09:00', 90)).toBe('10:30');
    expect(endTimeFor([[makeup], [makeup]], '15:00')).toBe('17:00');
    // maquiagem (60) + penteado (90) = 150 min; a segunda pessoa só penteado (90)
    expect(endTimeFor([[makeup, hair]], '15:00')).toBe('17:30');
    expect(endTimeFor([[makeup, hair], [hair]], '15:00')).toBe('19:00');
  });
});
