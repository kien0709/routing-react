import Capacitor

class MainViewController: CAPBridgeViewController {
    private let shakePlugin = DeviceShakePlugin()

    // local plugins have to be registered by hand
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(shakePlugin)
    }

    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake { shakePlugin.handleShake() }
        super.motionEnded(motion, with: event)
    }
}
