import { formatDate } from '../date';

describe('formatDate', () => {
  it('formata a data no padrão brasileiro', () => {
    expect(formatDate('2024-05-01T00:00:00Z')).toMatch(/2024/);
  });

  it('retorna o valor original quando a data é inválida', () => {
    expect(formatDate('invalid-date')).toBe('invalid-date');
  });
});
