import { registerPlugin } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";

// methodes van de native plugin
interface DeviceShakeNative {
  enableListening(): Promise<void>;
  stopListening(): Promise<void>;
  addListener(eventName: "shake", func: () => void): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

// naam moet gelijk zijn aan swift en java
const Native = registerPlugin<DeviceShakeNative>("DeviceShake");

export const DeviceShake = {
  enableListening: () => Native.enableListening(),
  stopListening: () => Native.stopListening(),
  addEventListener: (eventName: "shake", func: () => void) => Native.addListener(eventName, func),
  // zelfde als addEventListener
  addListener: (eventName: "shake", func: () => void) => Native.addListener(eventName, func),
  removeAllListeners: () => Native.removeAllListeners(),
};
