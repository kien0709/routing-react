import Capacitor

class MainViewController: CAPBridgeViewController {
    private let shakePlugin = DeviceShakePlugin()

    // local plugins have to be registered by hand
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(shakePlugin)
        // ios gebruikt schudden standaard voor ongedaan maken typen
        // dan komt er een undo popup over onze uitlog vraag dus dat zetten we uit
        UIApplication.shared.applicationSupportsShakeToEdit = false
    }

    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake { shakePlugin.handleShake() }
        super.motionEnded(motion, with: event)
    }
}
