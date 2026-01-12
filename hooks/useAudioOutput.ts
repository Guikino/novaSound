import { useState, useEffect } from 'react'
import * as Audio from 'expo-av' // Voltando para o AV que é o mais comum no Expo Go atual

export default function useAudioOutput() {
  const [isHeadsetConnected, setIsHeadsetConnected] = useState(false)
  const [deviceName, setDeviceName] = useState("NovaSound Device")

  useEffect(() => {
    const checkAudio = async () => {
      try {
       
        const audioModule = Audio as any
        
        if (audioModule && typeof audioModule.getAudioOutputsAsync === 'function') {
          const outputs = await audioModule.getAudioOutputsAsync()
          const bluetooth = outputs.find(
            (o: any) => o.type === 'Bluetooth' || o.type === 'Headphones'
          )
          
          setIsHeadsetConnected(!!bluetooth)
          if (bluetooth) setDeviceName(bluetooth.name || "Fone Conectado")
        } 
        // 2. Se a função acima não existir, tentamos o método de rotas (fallback)
        else if (typeof audioModule.getAudioRouteAsync === 'function') {
          const route = await audioModule.getAudioRouteAsync()
          const hasHeadset = route.outputs.some(
            (o: any) => o.type === 'Bluetooth' || o.type === 'Headphones'
          )
          setIsHeadsetConnected(hasHeadset)
        }
      } catch (e) {
        // Silencia erros de hardware para não travar a interface
      }
    }

    checkAudio()
    const interval = setInterval(checkAudio, 5000)
    return () => clearInterval(interval)
  }, [])

  return { isHeadsetConnected, deviceName }
}