import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface Props {
  /** PIX copia e cola: o mesmo código vira o QR Code. */
  code: string;
}

/** QR Code do PIX, sempre preto sobre branco (os apps de banco não leem em modo escuro). */
export function PixQr({ code }: Props) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let active = true;
    QRCode.toString(code, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })
      .then((svg) => {
        if (active) setSrc(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
      })
      .catch(() => {
        if (active) setSrc('');
      });
    return () => {
      active = false;
    };
  }, [code]);

  if (!src) return null;
  return <img className="ag-pix-qr" src={src} alt="QR Code do PIX do sinal" width={168} height={168} />;
}
