import { useState, useEffect } from 'react'
import * as BatteryAPI from 'expo-battery'

export function useBattery() {
  const [batteryLevel, setBatteryLevel] = useState<number>(0)
  const [isCharging, setIsCharging] = useState<boolean>(false)

  useEffect(() => {
    let levelSub: BatteryAPI.Subscription
    let stateSub: BatteryAPI.Subscription

    async function setupBattery() {
      const [level, status] = await Promise.all([
        BatteryAPI.getBatteryLevelAsync(),
        BatteryAPI.getBatteryStateAsync()
      ])
      
      setBatteryLevel(Math.round(level * 100))
      setIsCharging(status === BatteryAPI.BatteryState.CHARGING)

      levelSub = BatteryAPI.addBatteryLevelListener(({ batteryLevel }) => {
        setBatteryLevel(Math.round(batteryLevel * 100))
      })

      stateSub = BatteryAPI.addBatteryStateListener(({ batteryState }) => {
        setIsCharging(batteryState === BatteryAPI.BatteryState.CHARGING)
      })
    }

    setupBattery()

    return () => {
      levelSub?.remove()
      stateSub?.remove()
    }
  }, [])

  return { batteryLevel, isCharging }
}