import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom não implementa estas APIs.
window.HTMLElement.prototype.scrollIntoView = () => undefined;
window.HTMLElement.prototype.scrollBy = () => undefined;
