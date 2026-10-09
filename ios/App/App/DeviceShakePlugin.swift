import Capacitor

// eigen plugin die schudden doorgeeft aan javascript
// het schudden zelf komt binnen via motionEnded in MainViewController
@objc(DeviceShakePlugin)
public class DeviceShakePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "DeviceShakePlugin"
    public let jsName = "DeviceShake"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "enableListening", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopListening", returnType: CAPPluginReturnPromise),
    ]

    private var isListening = false

    @objc func enableListening(_ call: CAPPluginCall) {
        isListening = true
        call.resolve()
    }

    @objc func stopListening(_ call: CAPPluginCall) {
        isListening = false
        call.resolve()
    }

    func handleShake() {
        guard isListening else { return }
        notifyListeners("shake", data: [:])
    }
}
