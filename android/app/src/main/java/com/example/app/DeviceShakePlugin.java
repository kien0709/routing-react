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

// eigen plugin die schudden herkent met de accelerometer
// android heeft geen kant en klaar schud event zoals ios
@CapacitorPlugin(name = "DeviceShake")
public class DeviceShakePlugin extends Plugin implements SensorEventListener {
    // de accelerometer meet in m/s2 inclusief zwaartekracht stil liggen is 9.81 dus 1 g
    // de documentatie zegt niet wanneer iets een schud is dit getal hebben we zelf gekozen
    // zelfde als ios
    private static final float SHAKE_THRESHOLD_G = 2.7f;
    // niet elke meting tijdens een schud als nieuwe schud tellen
    private static final long MIN_INTERVAL_MS = 500;
    // hoe lang trillen bij een schud
    private static final long VIBRATE_MS = 200;

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private Vibrator vibrator;
    private boolean isListening = false;
    private long lastShake = 0;

    // wordt een keer uitgevoerd als de plugin laadt
    @Override
    public void load() {
        sensorManager = getContext().getSystemService(SensorManager.class);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        // vanaf android 12 via VibratorManager daarvoor direct de Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            vibrator = getContext().getSystemService(VibratorManager.class).getDefaultVibrator();
        } else {
            vibrator = getContext().getSystemService(Vibrator.class);
        }
    }

    @PluginMethod
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
    public void onSensorChanged(SensorEvent event) {
        // waarden in m/s2 delen door de zwaartekracht geeft g
        float x = event.values[0] / SensorManager.GRAVITY_EARTH;
        float y = event.values[1] / SensorManager.GRAVITY_EARTH;
        float z = event.values[2] / SensorManager.GRAVITY_EARTH;
        double gForce = Math.sqrt(x * x + y * y + z * z);

        long now = System.currentTimeMillis();
        if (gForce > SHAKE_THRESHOLD_G && now - lastShake > MIN_INTERVAL_MS) {
            lastShake = now;
            vibrate();
            notifyListeners("shake", new JSObject());
        }
    }

    // kort trillen als feedback VibrationEffect bestaat pas vanaf android 8
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

    // android raadt aan de sensor af te melden als de app op de achtergrond staat dat spaart batterij
    @Override
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
