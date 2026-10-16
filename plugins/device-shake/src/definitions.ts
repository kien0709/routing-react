import type { PluginListenerHandle } from '@capacitor/core';

export interface DeviceShakePlugin {
  /**
   * Start met luisteren naar schudden.
   */
  enableListening(): Promise<void>;

  /**
   * Stop met luisteren naar schudden.
   */
  stopListening(): Promise<void>;

  /**
   * Callback bij een schud, alleen als enableListening aan staat.
   */
  addListener(eventName: 'shake', listenerFunc: () => void): Promise<PluginListenerHandle>;

  /**
   * Alle listeners weghalen.
   */
  removeAllListeners(): Promise<void>;
}
