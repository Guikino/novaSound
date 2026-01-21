package com.guikino.exporouterexample

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*

class BluetoothModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BluetoothModule"

    @ReactMethod
    fun getConnectedDeviceInfo(promise: Promise) {
        val context = reactApplicationContext

        // 1. BLINDAGEM CONTRA CRASH (Android 12+)
        // Verifica se temos permissão. Se não tiver, retorna NULL (não crasha).
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // Sem permissão = age como se não tivesse fone conectado
                promise.resolve(null)
                return
            }
        }

        val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        val adapter = bluetoothManager.adapter

        // 2. Verifica se Bluetooth está desligado ou nulo
        if (adapter == null || !adapter.isEnabled) {
            promise.resolve(null)
            return
        }

        // 3. Tenta buscar dispositivo de Áudio (A2DP - Músicas)
        getDeviceFromProfile(adapter, BluetoothProfile.A2DP, promise) {
            // Se falhar, tenta buscar dispositivo de Chamada (HEADSET)
            getDeviceFromProfile(adapter, BluetoothProfile.HEADSET, promise) {
                // Se não achar nada, resolve como null
                promise.resolve(null)
            }
        }
    }

    private fun getDeviceFromProfile(adapter: BluetoothAdapter, profileType: Int, promise: Promise, onNotFound: () -> Unit) {
        try {
            // Verifica permissão novamente antes de chamar getProfileProxy (segurança extra)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                 if (ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                     onNotFound()
                     return
                 }
            }

            adapter.getProfileProxy(reactApplicationContext, object : BluetoothProfile.ServiceListener {
                override fun onServiceConnected(profile: Int, proxy: BluetoothProfile) {
                    try {
                        val connectedDevices = proxy.connectedDevices
                        if (connectedDevices.isNotEmpty()) {
                            val device = connectedDevices[0]
                            val map = Arguments.createMap()
                            
                            // Nome do dispositivo
                            try {
                                map.putString("name", device.name)
                            } catch (e: SecurityException) {
                                map.putString("name", "Dispositivo de Áudio")
                            }

                            // Bateria
                            val batteryLevel = try {
                                val method = device.javaClass.getMethod("getBatteryLevel")
                                method.invoke(device) as Int
                            } catch (e: Exception) {
                                -1
                            }

                            map.putInt("battery", batteryLevel)
                            promise.resolve(map)
                            
                            // Fecha o proxy para liberar memória
                            adapter.closeProfileProxy(profile, proxy)
                        } else {
                            adapter.closeProfileProxy(profile, proxy)
                            onNotFound()
                        }
                    } catch (e: Exception) {
                        // Qualquer erro interno, considera não encontrado
                        adapter.closeProfileProxy(profile, proxy)
                        onNotFound()
                    }
                }

                override fun onServiceDisconnected(profile: Int) {}
            }, profileType)
        } catch (e: Exception) {
            onNotFound()
        }
    }
}