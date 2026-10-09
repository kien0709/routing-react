import AudioToolbox
import Capacitor
import CoreMotion

// plugin die schudden doorgeeft aan javascript
@objc(DeviceShakePlugin)
public class DeviceShakePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "DeviceShakePlugin"
    public let jsName = "DeviceShake"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "enableListening", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopListening", returnType: CAPPluginReturnPromise),
    ]

    // vanaf hoeveel g het een schud is
    private let shakeThresholdG = 2.7
    // minimale tijd tussen twee schuds
    private let minInterval: TimeInterval = 0.5

    private let motionManager = CMMotionManager()
    private var isListening = false
    private var lastShake = Date.distantPast

    // start met luisteren
    @objc func enableListening(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.isListening = true
            self.startAccelerometer()
            call.resolve()
        }
    }

    // stop met luisteren
    @objc func stopListening(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.isListening = false
            self.stopAccelerometer()
            call.resolve()
        }
    }

    // accelerometer uitlezen op een echte iphone
    private func startAccelerometer() {
        guard motionManager.isAccelerometerAvailable, !motionManager.isAccelerometerActive else { return }

        motionManager.accelerometerUpdateInterval = 1.0 / 50.0
        motionManager.startAccelerometerUpdates(to: .main) { [weak self] data, _ in
            guard let self, let acceleration = data?.acceleration else { return }
            // totale kracht in g
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

    // trillen en de schud naar javascript sturen
    func handleShake() {
        guard isListening, Date().timeIntervalSince(lastShake) > minInterval else { return }
        lastShake = Date()

        AudioServicesPlayAlertSound(kSystemSoundID_Vibrate)
        notifyListeners("shake", data: [:])
    }

    deinit {
        stopAccelerometer()
    }
}
