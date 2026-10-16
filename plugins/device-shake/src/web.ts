import { WebPlugin } from '@capacitor/core';

import type { DeviceShakePlugin } from './definitions';

export class DeviceShakeWeb extends WebPlugin implements DeviceShakePlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
