import { useEffect, useState } from 'react';
import { fetchImage } from './adminApi';

interface Props {
  token: string;
  name: string;
  alt: string;
  onOpen: (url: string) => void;
}

/** Miniatura de uma foto de referência. A rota exige o token, então a imagem é baixada e exibida como blob. */
export function ProtectedImage({ token, name, alt, onOpen }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    fetchImage(token, name).then(
      (blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      },
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token, name]);

  if (failed) return <span className="pn-thumb pn-thumb--empty">Foto indisponível</span>;
  if (!url) return <span className="pn-thumb pn-thumb--empty" aria-label="Carregando foto" />;
  return (
    <button
      type="button"
      className="pn-thumb"
      onClick={() => {
        onOpen(url);
      }}
    >
      <img src={url} alt={alt} />
    </button>
  );
}
