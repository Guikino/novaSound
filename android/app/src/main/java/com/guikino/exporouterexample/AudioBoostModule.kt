package com.guikino.exporouterexample

import android.media.audiofx.LoudnessEnhancer
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AudioBoostModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var enhancer: LoudnessEnhancer? = null
    private var audioSessionId: Int = 0 

    override fun getName(): String = "AudioBoostModule"

    @ReactMethod
    fun setSoftwareGain(boostValue: Int) {
        try {
            if (enhancer == null) {
                enhancer = LoudnessEnhancer(audioSessionId)
            }
            enhancer?.enabled = true
            val gainTarget = boostValue * 20 
            enhancer?.setTargetGain(gainTarget)
            
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}