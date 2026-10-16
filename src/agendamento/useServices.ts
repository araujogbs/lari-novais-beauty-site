import { useEffect, useState } from 'react';
import * as api from './api';
import type { Service } from './types';

export type ServicesState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; services: Service[] };

export function useServices(): ServicesState {
  const [state, setState] = useState<ServicesState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    api
      .getServices()
      .then((list) => {
        if (cancelled) return;
        setState({ status: 'ready', services: (list ?? []).filter((s) => s.isActive !== false) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
