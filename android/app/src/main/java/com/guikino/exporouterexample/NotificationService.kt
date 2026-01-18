package com.guikino.exporouterexample

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationService : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        // O sistema chama isso quando uma nova notificação aparece
        Log.d("NotificationService", "Notificação recebida de: ${sbn?.packageName}")
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        // O sistema chama isso quando uma notificação é removida
        Log.d("NotificationService", "Notificação removida")
    }
}