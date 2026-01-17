import { useState, useEffect } from 'react'
import { VolumeManager } from 'react-native-volume-manager'

export const useVolume = () => {
  const [volume, setVolume] = useState<number>(0)

  useEffect(() => {

    const getInitialVolume = async () => {
      const result = await VolumeManager.getVolume()
      const currentVolume = typeof result === 'number' ? result : result.volume
      setVolume(currentVolume)
    }
    getInitialVolume()
    const volumeListener = VolumeManager.addVolumeListener((result) => {
      setVolume(result.volume)
    })

    return () => volumeListener.remove()
  }, [])

  const updateVolume = async (newValue: number) => {
    await VolumeManager.setVolume(newValue, { showUI: false })
    setVolume(newValue)
  }


  return { volume, updateVolume }
}