package com.guikino.exporouterexample

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.content.Context
import com.facebook.react.bridge.*

class BluetoothModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BluetoothModule"

    @ReactMethod
    fun getConnectedDeviceInfo(promise: Promise) {
        val bluetoothManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        val adapter = bluetoothManager.adapter

        if (adapter == null || !adapter.isEnabled) {
            val map = Arguments.createMap()
            map.putString("error", "Bluetooth is disabled or not available")
            promise.resolve(map)
            return
        }

        // Usamos o perfil HEADSET para pegar fones de ouvido
        adapter.getProfileProxy(reactApplicationContext, object : BluetoothProfile.ServiceListener {
            override fun onServiceConnected(profile: Int, proxy: BluetoothProfile) {
                val connectedDevices = proxy.connectedDevices
                if (connectedDevices.isNotEmpty()) {
                    val device = connectedDevices[0]
                    val map = Arguments.createMap()
                    
                    map.putString("name", device.name)
                    
                    // Tentativa de pegar bateria via Metadados (Android 9+)
                    // Se não disponível, tentamos via reflexão de comando AT
                    val batteryLevel = try {
                        val method = device.javaClass.getMethod("getBatteryLevel")
                        method.invoke(device) as Int
                    } catch (e: Exception) {
                        -1
                    }

                    map.putInt("battery", batteryLevel)
                    promise.resolve(map)
                } else {
                    promise.resolve(null)
                }
                adapter.closeProfileProxy(profile, proxy)
            }

            override fun onServiceDisconnected(profile: Int) {}
        }, BluetoothProfile.HEADSET)
    }
}