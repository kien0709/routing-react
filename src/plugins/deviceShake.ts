import { DeviceShake as Native } from "capacitor-device-shake";

// opdracht noemt het addEventListener, capacitor noemt het addListener
export const DeviceShake = {
  enableListening: () => Native.enableListening(),
  stopListening: () => Native.stopListening(),
  addEventListener: (eventName: "shake", func: () => void) => Native.addListener(eventName, func),
  addListener: (eventName: "shake", func: () => void) => Native.addListener(eventName, func),
  removeAllListeners: () => Native.removeAllListeners(),
};
