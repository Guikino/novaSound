import { NativeModules } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';

const { FindMyBudsModule } = NativeModules;
const BEEP_DURATION_MS = 6000000; 

export const useFindMyBuds = () => {
  const [isBeeping, setIsBeeping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopBeeping = useCallback(() => {
    try {
      FindMyBudsModule.stopBeeping();
      setIsBeeping(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } catch (e) {
      console.error("Erro ao parar localizador:", e);
    }
  }, []);

  const startBeeping = useCallback(() => {
    try {
      FindMyBudsModule.startBeeping();
      setIsBeeping(true);
      timerRef.current = setTimeout(() => {
        stopBeeping();
      }, BEEP_DURATION_MS);

    } catch (e) {
      console.error("Erro ao iniciar localizador:", e);
    }
  }, [stopBeeping]);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      FindMyBudsModule.stopBeeping();
    };
  }, []);

  return { isBeeping, startBeeping, stopBeeping };
};