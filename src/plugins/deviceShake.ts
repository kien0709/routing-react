import { registerPlugin } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";

// eigen plugin zie DeviceShakePlugin swift voor ios en java voor android
// https://capacitorjs.com/docs/ios/custom-code
interface DeviceShakeNative {
  enableListening(): Promise<void>;
  stopListening(): Promise<void>;
  addListener(eventName: "shake", func: () => void): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

// de naam moet gelijk zijn aan jsName in swift en name in java
const Native = registerPlugin<DeviceShakeNative>("DeviceShake");

export const DeviceShake = {
  enableListening: () => Native.enableListening(),
  stopListening: () => Native.stopListening(),
  addEventListener: (eventName: "shake", func: () => void) => Native.addListener(eventName, func),
  // zelfde als addEventListener met de standaard capacitor naam zoals in de opdracht
  addListener: (eventName: "shake", func: () => void) => Native.addListener(eventName, func),
  removeAllListeners: () => Native.removeAllListeners(),
};
