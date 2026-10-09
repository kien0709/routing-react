package com.example.app;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// plugin die schudden doorgeeft aan javascript
@CapacitorPlugin(name = "DeviceShake")
public class DeviceShakePlugin extends Plugin implements SensorEventListener {
    // vanaf hoeveel g het een schud is
    private static final float SHAKE_THRESHOLD_G = 2.7f;
    // minimale tijd tussen twee schuds
    private static final long MIN_INTERVAL_MS = 500;
    // hoe lang trillen
    private static final long VIBRATE_MS = 200;

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private Vibrator vibrator;
    private boolean isListening = false;
    private long lastShake = 0;

    @Override
    // sensor en vibrator ophalen
    public void load() {
        sensorManager = getContext().getSystemService(SensorManager.class);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            vibrator = getContext().getSystemService(VibratorManager.class).getDefaultVibrator();
        } else {
            vibrator = getContext().getSystemService(Vibrator.class);
        }
    }

    @PluginMethod
    // start met luisteren
    public void enableListening(PluginCall call) {
        if (accelerometer == null) {
            call.reject("No accelerometer on this device");
            return;
        }
        isListening = true;
        startSensor();
        call.resolve();
    }

    @PluginMethod
    // stop met luisteren
    public void stopListening(PluginCall call) {
        isListening = false;
        stopSensor();
        call.resolve();
    }

    private void startSensor() {
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_UI);
    }

    private void stopSensor() {
        sensorManager.unregisterListener(this);
    }

    @Override
    // nieuwe meting van de accelerometer
    public void onSensorChanged(SensorEvent event) {
        float x = event.values[0] / SensorManager.GRAVITY_EARTH;
        float y = event.values[1] / SensorManager.GRAVITY_EARTH;
        float z = event.values[2] / SensorManager.GRAVITY_EARTH;
        // totale kracht in g
        double gForce = Math.sqrt(x * x + y * y + z * z);

        long now = System.currentTimeMillis();
        if (gForce > SHAKE_THRESHOLD_G && now - lastShake > MIN_INTERVAL_MS) {
            lastShake = now;
            vibrate();
            notifyListeners("shake", new JSObject());
        }
    }

    // kort trillen
    private void vibrate() {
        if (vibrator == null || !vibrator.hasVibrator()) return;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(VIBRATE_MS, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            vibrator.vibrate(VIBRATE_MS);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    @Override
    // sensor uit als de app op de achtergrond staat
    protected void handleOnPause() {
        stopSensor();
    }

    @Override
    protected void handleOnResume() {
        if (isListening) startSensor();
    }

    @Override
    protected void handleOnDestroy() {
        stopSensor();
    }
}
