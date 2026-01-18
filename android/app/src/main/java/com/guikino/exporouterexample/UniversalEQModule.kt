package com.guikino.exporouterexample

import android.media.audiofx.Equalizer
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class UniversalEQModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var equalizer: Equalizer? = null
    private val TAG = "UniversalEQ"

    override fun getName(): String {
        return "UniversalEQ"
    }

    // Inicia a sessão de áudio global
    @ReactMethod
    fun startSession() {
        try {
            if (equalizer == null) {
                // Priority 0, AudioSession 0 (Global Mix - afeta Spotify, YouTube, etc)
                equalizer = Equalizer(0, 0)
                equalizer?.enabled = true
                Log.d(TAG, "Equalizer session started")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error starting equalizer: " + e.message)
        }
    }

    // Define o ganho de uma banda (0 a 100 no React Native -> convertido para milibels no Android)
    @ReactMethod
    fun setBandLevel(bandIndex: Int, levelPercent: Int) {
        try {
            equalizer?.let { eq ->
                // O Android trabalha com bandas físicas limitadas (geralmente 5).
                // Precisamos garantir que não estamos chamando um index que não existe.
                if (bandIndex < eq.numberOfBands) {
                    
                    // Pega o alcance do equalizador (ex: -1500mB a +1500mB)
                    val range = eq.bandLevelRange // Retorna array [min, max]
                    val min = range[0]
                    val max = range[1]

                    // Matemática para converter 0-100 (do seu slider) para o alcance do Android
                    // Ex: 50% = 0dB (Flat)
                    val newLevel = min + ((max - min) * (levelPercent / 100.0)).toInt()

                    eq.setBandLevel(bandIndex.toShort(), newLevel.toShort())
                    Log.d(TAG, "Set band $bandIndex to $newLevel mB")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error setting band level: " + e.message)
        }
    }

    // Limpa a memória ao fechar
    @ReactMethod
    fun stopSession() {
        try {
            equalizer?.enabled = false
            equalizer?.release()
            equalizer = null
            Log.d(TAG, "Equalizer session stopped")
        } catch (e: Exception) {
             Log.e(TAG, "Error stopping equalizer: " + e.message)
        }
    }
}