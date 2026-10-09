import AudioToolbox
import Capacitor
import CoreMotion

// eigen plugin die schudden doorgeeft aan javascript
// op een echte iphone met de accelerometer van core motion
// de simulator heeft geen accelerometer daar komt schudden binnen via motionEnded in MainViewController
// https://developer.apple.com/documentation/coremotion/cmmotionmanager
@objc(DeviceShakePlugin)
public class DeviceShakePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "DeviceShakePlugin"
    public let jsName = "DeviceShake"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "enableListening", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopListening", returnType: CAPPluginReturnPromise),
    ]

    // hoe hard je moet schudden in g zwaartekracht is 1 zelfde als android
    private let shakeThresholdG = 2.7
    // niet elke meting tijdens een schud als nieuwe schud tellen
    private let minInterval: TimeInterval = 0.5

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
            self.motionManager.stopAccelerometerUpdates()
            call.resolve()
        }
    }

    private func startAccelerometer() {
        guard motionManager.isAccelerometerAvailable, !motionManager.isAccelerometerActive else { return }

        motionManager.accelerometerUpdateInterval = 0.05
        motionManager.startAccelerometerUpdates(to: .main) { [weak self] data, _ in
            guard let self, let acceleration = data?.acceleration else { return }
            let gForce = sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z)
            if gForce > self.shakeThresholdG {
                self.handleShake()
            }
        }
    }

    // wordt aangeroepen door de accelerometer en door motionEnded
    func handleShake() {
        guard isListening, Date().timeIntervalSince(lastShake) > minInterval else { return }
        lastShake = Date()

        // trillen als feedback
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
        notifyListeners("shake", data: [:])
    }

    deinit {
        motionManager.stopAccelerometerUpdates()
    }
}
