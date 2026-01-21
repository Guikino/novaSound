import { useEffect, useState, useCallback } from 'react';
import { NativeModules, Platform, PermissionsAndroid, AppState } from 'react-native';

const { BluetoothModule } = NativeModules;

export default function useAudioOutput() {
  const [isHeadsetConnected, setIsHeadsetConnected] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState("Alto-falante");
  const [deviceBattery, setDeviceBattery] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // NOVO: Estado para controlar se a permissão foi dada
  const [hasPermission, setHasPermission] = useState(false);

  const checkConnection = useCallback(async (forcePermission = false) => {
    if (Platform.OS === 'android') {
      let permissionGranted = true;

      // Se for Android 12+, verifica permissão real
      if (Platform.Version >= 31) {
        const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        
        if (!check) {
          if (forcePermission) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
            permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
          } else {
            permissionGranted = false;
          }
        }
      }

      // Atualiza o estado da permissão
      setHasPermission(permissionGranted);

      if (permissionGranted) {
        try {
          const info = await BluetoothModule.getConnectedDeviceInfo();
          if (info) {
            setIsHeadsetConnected(true);
            setDeviceName(info.name);
            setDeviceBattery(info.battery !== undefined && info.battery !== -1 ? info.battery : null);
          } else {
            setIsHeadsetConnected(false);
            setDeviceName("Alto-falante");
            setDeviceBattery(null);
          }
        } catch (e) {
          console.error("Erro Bluetooth:", e);
          setIsHeadsetConnected(false);
        }
      } else {
        setIsHeadsetConnected(false);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkConnection(false);
    const interval = setInterval(() => {
      checkConnection(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkConnection(false);
      }
    });
    return () => subscription.remove();
  }, [checkConnection]);

  return { 
    isHeadsetConnected, 
    deviceName, 
    deviceBattery, 
    isLoading,
    hasPermission, 
    requestConnection: () => checkConnection(true),
    checkConnection,
  };
}