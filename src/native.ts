import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { SplashScreen } from "@capacitor/splash-screen";
import { SafeArea } from "capacitor-plugin-safe-area";

// alles hier doet alleen iets in de ios/android app niet in de browser
const isNative = Capacitor.isNativePlatform();

// safe area van de telefoon als css variabelen zetten zodat niks onder de statusbalk of navigatiebalk valt
// gebruik in css var(--safe-area-inset-top) enz zie index css
// https://www.npmjs.com/package/capacitor-plugin-safe-area
function setSafeAreaVariables(insets: { top: number; right: number; bottom: number; left: number }) {
  for (const [key, value] of Object.entries(insets)) {
    document.documentElement.style.setProperty(`--safe-area-inset-${key}`, `${value}px`);
  }
}

async function initSafeArea() {
  const { insets } = await SafeArea.getSafeAreaInsets();
  setSafeAreaVariables(insets);

  // bij draaien van de telefoon veranderen de insets
  await SafeArea.addListener("safeAreaChanged", (data) => setSafeAreaVariables(data.insets));
}

// een korte tik bij elke knop of link die je indrukt
// https://capacitorjs.com/docs/apis/haptics
function initHaptics() {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const pressable = target?.closest("button, a, [role='button'], [role='menuitem'], [role='tab']");
    if (!pressable || pressable.matches(":disabled, [aria-disabled='true']")) return;

    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
  });
}

// zoomen uit in de app
function disableZoom() {
  const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!viewport) return;
  viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
}

export function initNative() {
  if (!isNative) return;

  disableZoom();
  initSafeArea().catch((error) => console.error("safe area", error));
  initHaptics();

  // voor de zekerheid splash toch verbergen als firebase niet antwoordt
  setTimeout(hideSplashScreen, 5000);
}

// splash scherm verbergen zodra de app weet of je ingelogd bent
// in capacitor config staat launchAutoHide uit zodat je het laadscherm niet ziet
// https://capacitorjs.com/docs/apis/splash-screen
export function hideSplashScreen() {
  if (!isNative) return;

  SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
}
