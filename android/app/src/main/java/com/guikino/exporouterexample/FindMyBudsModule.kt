package com.guikino.exporouterexample

import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FindMyBudsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var toneGenerator: ToneGenerator? = null
    private var isBeeping = false
    private val handler = Handler(Looper.getMainLooper())

    override fun getName(): String = "FindMyBudsModule"
    private val beepRunnable = object : Runnable {
        override fun run() {
            if (isBeeping) {
                toneGenerator?.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 1000)
                handler.postDelayed(this, 2000)
            }
        }
    }

    @ReactMethod
    fun startBeeping() {
        if (isBeeping) return

        try {
            val audioManager = reactApplicationContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, maxVolume, 0)
            if (toneGenerator == null) {
                toneGenerator = ToneGenerator(AudioManager.STREAM_MUSIC, 100)
            }
            isBeeping = true
            handler.post(beepRunnable)

        } catch (e: Exception) {
            e.printStackTrace()
            isBeeping = false
        }
    }

    @ReactMethod
    fun stopBeeping() {
        try {
            isBeeping = false
            handler.removeCallbacks(beepRunnable)
            toneGenerator?.stopTone()
            toneGenerator?.release()
            toneGenerator = null
            
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}