package com.example.app;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// eigen plugin die schudden herkent met de versnellingsmeter
// android heeft geen kant en klaar schud event zoals ios
@CapacitorPlugin(name = "DeviceShake")
public class DeviceShakePlugin extends Plugin implements SensorEventListener {
    // hoe hard je moet schudden in g zwaartekracht is 1
    private static final float SHAKE_THRESHOLD_G = 2.7f;
    // niet elke meting tijdens een schud als nieuwe schud tellen
    private static final long MIN_INTERVAL_MS = 500;

    // hoe lang trillen bij een schud
    private static final long VIBRATE_MS = 200;

    private SensorManager sensorManager;
    private Vibrator vibrator;
    private long lastShake = 0;

    @Override
    public void load() {
        sensorManager = (SensorManager) getContext().getSystemService(Context.SENSOR_SERVICE);
        vibrator = (Vibrator) getContext().getSystemService(Context.VIBRATOR_SERVICE);
    }

    @PluginMethod
    public void enableListening(PluginCall call) {
        Sensor accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        if (accelerometer == null) {
            call.reject("No accelerometer on this device");
            return;
        }
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_UI);
        call.resolve();
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        sensorManager.unregisterListener(this);
        call.resolve();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
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

    // trillen als feedback VibrationEffect bestaat pas vanaf android 8
    // https://developer.android.com/reference/android/os/Vibrator
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
    protected void handleOnDestroy() {
        sensorManager.unregisterListener(this);
    }
}
