/* eslint-disable import/no-dynamic-require */
import { join } from 'path';

export * from './infras';
export * from './exceptions';
export * from './common';
export * from './models';
export * from './helpers';
export * from './events';

export function getConfig(configName = 'app') {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  return require(join(__dirname, '..', 'config', configName)).default;
}
