import { describe, expect, it } from 'vitest';
import {
  acceptFiles,
  buildAppointmentForm,
  durationLabel,
  EMPTY_VALUES,
  firstError,
  endTimeFor,
  parsePeople,
  plusMinutes,
  total,
} from './booking';
import type { BookingValues, Service } from './types';

const service: Service = { id: 3, name: 'Maquiagem + Penteado', durationMinutes: 120, price: 550 };
const valid: BookingValues = {
  nome: ' Maria Souza ',
  fone: '(11) 91234-5678',
  cep: '01310-100',
  num: '120, apto 32',
  end: 'Av. Paulista',
  qtd: '2',
  msg: 'Casamento',
};
const file = (type: string, size = 10): File => new File([new Uint8Array(size)], 'x', { type });

describe('firstError', () => {
  it('valida na ordem dos passos', () => {
    expect(firstError(valid, undefined, '2030-01-10', '09:00')).toBe('Escolha o serviço.');
    expect(firstError(valid, service, '', '09:00')).toBe('Escolha a data e o horário.');
    expect(firstError(valid, service, '2030-01-10', '')).toBe('Escolha a data e o horário.');
    expect(firstError(EMPTY_VALUES, service, '2030-01-10', '09:00')).toBe('Informe o seu nome completo.');
    expect(firstError({ ...valid, fone: '1191' }, service, '2030-01-10', '09:00')).toBe(
      'Informe um WhatsApp válido com DDD.',
    );
    expect(firstError({ ...valid, cep: '', end: '' }, service, '2030-01-10', '09:00')).toBe(
      'Informe o CEP ou o endereço do atendimento.',
    );
    expect(firstError({ ...valid, msg: '  ' }, service, '2030-01-10', '09:00')).toBe(
      'Conte como você quer a sua produção.',
    );
  });

  it('retorna null quando tudo está preenchido', () => {
    expect(firstError(valid, service, '2030-01-10', '09:00')).toBeNull();
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
    const fd = buildAppointmentForm(valid, service, '2030-01-10', '09:00', [file('image/png')]);
    expect(fd.get('clientName')).toBe('Maria Souza');
    expect(fd.get('clientAddress')).toBe('Av. Paulista, 120, apto 32 — CEP 01310-100');
    expect(fd.get('cep')).toBe('01310100');
    expect(fd.get('serviceItemId')).toBe('3');
    expect(fd.get('startTime')).toBe('2030-01-10T09:00:00-03:00');
    expect(fd.get('people')).toBe('2');
    expect(fd.get('description')).toBe('Atendimento Social.\nCasamento');
    expect(fd.getAll('images')).toHaveLength(1);
  });

  it('omite o CEP quando incompleto e assume 1 pessoa se a quantidade for inválida', () => {
    const fd = buildAppointmentForm({ ...valid, cep: '0131', qtd: '' }, service, '2030-01-10', '09:00', []);
    expect(fd.has('cep')).toBe(false);
    expect(fd.get('people')).toBe('1');
  });
});

describe('total', () => {
  it('soma serviço e deslocamento', () => {
    expect(total(service, { distanceKm: 10, travelFee: 40 })).toBe(590);
    expect(total(service, undefined)).toBe(550);
    expect(total(undefined, undefined)).toBe(0);
  });

  it('multiplica o serviço pelo número de pessoas, sem multiplicar o deslocamento', () => {
    expect(total(service, { distanceKm: 10, travelFee: 40 }, 2)).toBe(1140);
  });
});

describe('parsePeople', () => {
  it('limita entre 1 e 20 e assume 1 se inválido', () => {
    expect(parsePeople('3')).toBe(3);
    expect(parsePeople('')).toBe(1);
    expect(parsePeople('0')).toBe(1);
    expect(parsePeople('99')).toBe(20);
  });
});

describe('durationLabel', () => {
  it('mostra 60 a 90 min para penteado avulso', () => {
    expect(durationLabel({ id: 1, name: 'Penteado', durationMinutes: 60, price: 350 })).toBe('60 a 90 min');
  });

  it('mantém a duração cadastrada nos demais serviços', () => {
    expect(durationLabel({ id: 2, name: 'Maquiagem', durationMinutes: 75, price: 350 })).toBe('75 min');
    expect(durationLabel({ id: 3, name: 'Maquiagem + Penteado', durationMinutes: 150, price: 700 })).toBe('150 min');
  });
});

describe('término previsto', () => {
  it('soma a duração total (serviço x pessoas) ao horário de início', () => {
    expect(plusMinutes('09:00', 90)).toBe('10:30');
    expect(endTimeFor({ id: 1, name: 'Maquiagem', durationMinutes: 60, price: 350 }, 2, '15:00')).toBe('17:00');
  });
});
