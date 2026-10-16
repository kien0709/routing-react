import { WebPlugin } from '@capacitor/core';

import type { DeviceShakePlugin } from './definitions';

// in de browser is er geen schud, dus niks doen
export class DeviceShakeWeb extends WebPlugin implements DeviceShakePlugin {
  async enableListening(): Promise<void> {}

  async stopListening(): Promise<void> {}
}
