/* eslint-disable no-console */
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[Tramorama] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[Tramorama] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[Tramorama] ${message}`, ...args);
  }
};
