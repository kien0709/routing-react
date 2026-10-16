import { registerPlugin } from '@capacitor/core';

import type { DeviceShakePlugin } from './definitions';

const DeviceShake = registerPlugin<DeviceShakePlugin>('DeviceShake', {
  web: () => import('./web').then((m) => new m.DeviceShakeWeb()),
});

export * from './definitions';
export { DeviceShake };
