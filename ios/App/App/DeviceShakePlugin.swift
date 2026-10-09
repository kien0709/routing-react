import AudioToolbox
import Capacitor
import CoreMotion

// eigen plugin die schudden doorgeeft aan javascript
// op een echte iphone met de accelerometer van core motion
// de simulator heeft geen accelerometer daar komt schudden binnen via motionEnded in MainViewController
@objc(DeviceShakePlugin)
public class DeviceShakePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "DeviceShakePlugin"
    public let jsName = "DeviceShake"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "enableListening", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopListening", returnType: CAPPluginReturnPromise),
    ]

    // apple meet in g dus 1.0 is gewoon de zwaartekracht als de telefoon stil ligt
    // de documentatie zegt niet wanneer iets een schud is dit getal hebben we zelf gekozen
    // zelfde als android
    private let shakeThresholdG = 2.7
    // niet elke meting tijdens een schud als nieuwe schud tellen
    private let minInterval: TimeInterval = 0.5

    // apple gebruikt in de voorbeelden een enkele motion manager
    private let motionManager = CMMotionManager()
    private var isListening = false
    private var lastShake = Date.distantPast

    @objc func enableListening(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.isListening = true
            self.startAccelerometer()
            call.resolve()
        }
    }

    @objc func stopListening(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.isListening = false
            self.stopAccelerometer()
            call.resolve()
        }
    }

    private func startAccelerometer() {
        // zonder accelerometer zoals in de simulator komt er geen data
        guard motionManager.isAccelerometerAvailable, !motionManager.isAccelerometerActive else { return }

        // 50 keer per seconde zoals in het voorbeeld van apple
        motionManager.accelerometerUpdateInterval = 1.0 / 50.0
        motionManager.startAccelerometerUpdates(to: .main) { [weak self] data, _ in
            guard let self, let acceleration = data?.acceleration else { return }
            let gForce = sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z)
            if gForce > self.shakeThresholdG {
                self.handleShake()
            }
        }
    }

    private func stopAccelerometer() {
        if motionManager.isAccelerometerActive {
            motionManager.stopAccelerometerUpdates()
        }
    }

    // wordt aangeroepen door de accelerometer en door motionEnded
    func handleShake() {
        guard isListening, Date().timeIntervalSince(lastShake) > minInterval else { return }
        lastShake = Date()

        // kort trillen als feedback
        AudioServicesPlayAlertSound(kSystemSoundID_Vibrate)
        notifyListeners("shake", data: [:])
    }

    deinit {
        stopAccelerometer()
    }
}
