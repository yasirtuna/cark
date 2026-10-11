import { vi } from 'vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

let rafEnabled = true;
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
  if (!rafEnabled) return 0;
  return setTimeout(() => cb(performance.now() + 16), 16) as unknown as number;
});
vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));

vi.stubGlobal('performance', globalThis.performance);

export { rafEnabled };