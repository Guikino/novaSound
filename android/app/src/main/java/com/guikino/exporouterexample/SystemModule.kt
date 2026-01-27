package com.guikino.exporouterexample

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SystemModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SystemModule"

    @ReactMethod
    fun getAppVersion(promise: Promise) {
        try {
            val pInfo = reactApplicationContext.packageManager.getPackageInfo(reactApplicationContext.packageName, 0)
            val version = pInfo.versionName // Ex: "1.0.0a"
            promise.resolve(version)
        } catch (e: Exception) {
            promise.resolve("Unknown")
        }
    }
}