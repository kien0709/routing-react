import UIKit
import Capacitor

class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        // shake to undo van ios uitzetten
        UIApplication.shared.applicationSupportsShakeToEdit = false
    }

    // schud event van ios doorgeven aan de DeviceShake plugin (werkt ook in de simulator)
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake {
            NotificationCenter.default.post(name: Notification.Name("DeviceShakeMotionShake"), object: nil)
        }
        super.motionEnded(motion, with: event)
    }
}
