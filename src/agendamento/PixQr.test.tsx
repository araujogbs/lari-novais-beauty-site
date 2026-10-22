import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PixQr } from './PixQr';

describe('PixQr', () => {
  it('desenha o QR Code do código PIX como imagem SVG', async () => {
    render(<PixQr code="00020101021126360014br.gov.bcb.pix6304ABCD" />);
    const img = await screen.findByAltText('QR Code do PIX do sinal');
    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
  });
});
