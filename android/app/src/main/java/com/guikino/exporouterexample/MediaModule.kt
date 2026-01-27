package com.guikino.exporouterexample

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.provider.Settings
import com.facebook.react.bridge.*

class MediaModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "MediaModule"

    private fun getActiveController(): MediaController? {
        val manager = reactApplicationContext.getSystemService(Context.MEDIA_SESSION_SERVICE) as MediaSessionManager
        val componentName = ComponentName(reactApplicationContext, NotificationService::class.java)
        return manager.getActiveSessions(componentName).firstOrNull()
    }

    // --- NOVO MÉTODO: Verifica se há mídia ativa ---
    @ReactMethod
    fun isMediaActive(promise: Promise) {
        try {
            val controller = getActiveController()
            promise.resolve(controller != null)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }
    // -----------------------------------------------

    @ReactMethod
    fun playPause() {
        val controller = getActiveController()
        val state = controller?.playbackState?.state
        if (state == PlaybackState.STATE_PLAYING) {
            controller?.transportControls?.pause()
        } else {
            controller?.transportControls?.play()
        }
    }

    @ReactMethod
    fun skipToNext() {
        getActiveController()?.transportControls?.skipToNext()
    }

    @ReactMethod
    fun skipToPrevious() {
        getActiveController()?.transportControls?.skipToPrevious()
    }

    @ReactMethod
    fun requestPermission() {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun checkPermission(promise: Promise) {
        val pkgName = reactApplicationContext.packageName
        val flat = Settings.Secure.getString(reactApplicationContext.contentResolver, "enabled_notification_listeners")
        val enabled = flat != null && flat.contains(pkgName)
        promise.resolve(enabled)
    }
    @ReactMethod
    fun getPlaybackState(promise: Promise) {
        try {
            val controller = getActiveController()
            if (controller == null) {
                promise.resolve("STOPPED")
                return
            }

            val state = controller.playbackState?.state
            if (state == PlaybackState.STATE_PLAYING) {
                promise.resolve("PLAYING")
            } else {
                promise.resolve("PAUSED")
            }
        } catch (e: Exception) {
            promise.resolve("ERROR")
        }
    }

  
    
}