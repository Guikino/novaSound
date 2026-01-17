import { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

const { BluetoothModule } = NativeModules;

export default function useAudioOutput() {
  const [isHeadsetConnected, setIsHeadsetConnected] = useState(false);
  const [deviceName, setDeviceName] = useState("Alto-falante");
  const [deviceBattery, setDeviceBattery] = useState<number | null>(null);

  const updateDeviceInfo = async () => {
    if (Platform.OS === 'android') {
      try {
        const info = await BluetoothModule.getConnectedDeviceInfo();
        if (info) {
          setIsHeadsetConnected(true);
          setDeviceName(info.name);
          // O valor -1 indica que o fone não informou a bateria
         setDeviceBattery(info.battery !== undefined && info.battery !== -1 ? info.battery : null);
        } else {
          setIsHeadsetConnected(false);
          setDeviceName("Alto-falante");
          setDeviceBattery(null);
        }
      } catch (e) {
        console.error("Erro no módulo nativo:", e);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(updateDeviceInfo, 3000);
    return () => clearInterval(interval);
  }, []);

  return { isHeadsetConnected, deviceName, deviceBattery };
}