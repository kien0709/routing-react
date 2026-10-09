import UIKit
import Capacitor

class MainViewController: CAPBridgeViewController {
    private let shakePlugin = DeviceShakePlugin()

    // plugin registreren
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(shakePlugin)

        // shake to undo van ios uitzetten
        UIApplication.shared.applicationSupportsShakeToEdit = false
    }

    // schud event van ios ook in de simulator
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake { shakePlugin.handleShake() }
        super.motionEnded(motion, with: event)
    }
}
