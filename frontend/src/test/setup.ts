import "@testing-library/jest-dom/vitest";

const store = new Map<string, string>();

const mockStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
};

Object.defineProperty(globalThis, "localStorage", { value: mockStorage, writable: true });
Object.defineProperty(globalThis, "sessionStorage", { value: mockStorage, writable: true });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("light") ? false : false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});