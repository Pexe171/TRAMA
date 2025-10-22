type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const buildLogger = (level: LogLevel) =>
  (...args: unknown[]) => {
    if (__DEV__) {
      console[level](...args);
    }
  };

export const logger = {
  info: buildLogger('info'),
  warn: buildLogger('warn'),
  error: buildLogger('error'),
  debug: buildLogger('debug')
};
