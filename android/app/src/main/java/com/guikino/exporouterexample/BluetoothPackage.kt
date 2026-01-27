package com.guikino.exporouterexample

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class BluetoothPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            BluetoothModule(reactContext),
            MediaModule(reactContext),
            SystemModule(reactContext),
            UniversalEQModule(reactContext),
            FindMyBudsModule(reactContext),
            AudioBoostModule(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}