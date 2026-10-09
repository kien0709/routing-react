import UIKit
import Capacitor

// eigen view controller zodat we onze plugin kunnen registreren en schudden kunnen opvangen
// de documentatie zet hem in Main.storyboard maar deze app maakt de view controller in SceneDelegate
class MainViewController: CAPBridgeViewController {
    private let shakePlugin = DeviceShakePlugin()

    // eigen plugins in de app moet je zelf registreren
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(shakePlugin)

        // ios gebruikt schudden standaard voor ongedaan maken van typen
        // dan komt er een undo popup over onze uitlog vraag dus dat zetten we uit
        UIApplication.shared.applicationSupportsShakeToEdit = false
    }

    // ios meldt een schud aan het begin en het einde hier gebruiken we het einde
    // standaard gaat het event door naar de volgende responder daarom roepen we super aan
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake { shakePlugin.handleShake() }
        super.motionEnded(motion, with: event)
    }
}
