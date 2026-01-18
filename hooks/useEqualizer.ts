import { useState, useEffect, useCallback } from 'react';
import { NativeModules, Platform } from 'react-native';

const { UniversalEQ } = NativeModules;

export interface EqBands {
  hz60: number;
  hz230: number;
  hz910: number;
  hz3600: number;
  hz14000: number;
}

export const useEqualizer = () => {
  const [bands, setBands] = useState<EqBands>({
    hz60: 50, hz230: 50, hz910: 50, hz3600: 50, hz14000: 50,
  });

  // Inicia a sessão no Android
  useEffect(() => {
    if (Platform.OS === 'android' && UniversalEQ) {
      UniversalEQ.startSession();
    }
    return () => {
      if (Platform.OS === 'android' && UniversalEQ) {
        UniversalEQ.stopSession();
      }
    };
  }, []);

  // Comunicação com o módulo nativo
  const updateNative = useCallback((index: number, value: number) => {
    if (Platform.OS === 'android' && UniversalEQ) {
      UniversalEQ.setBandLevel(index, value);
    }
  }, []);

  // Função para os Sliders manuais
  const setManualBand = (bandKey: keyof EqBands, value: number) => {
    const bandMap: Record<keyof EqBands, number> = { 
        hz60: 0, hz230: 1, hz910: 2, hz3600: 3, hz14000: 4 
    };
    setBands(prev => ({ ...prev, [bandKey]: value }));
    updateNative(bandMap[bandKey], value);
  };
  const applyPreset = useCallback((type: string) => {
    let newBands: EqBands = { ...bands };

    console.log("Aplicando Preset:", type);

   switch (type) {

      case 'Balanced': 
        newBands = { hz60: 50, hz230: 50, hz910: 50, hz3600: 50, hz14000: 50 }; 
        break;
      

      case 'Gamer': 
        newBands = { hz60: 55, hz230: 40, hz910: 45, hz3600: 80, hz14000: 65 }; 
        break;

      case 'Metal': 
        newBands = { hz60: 80, hz230: 40, hz910: 35, hz3600: 75, hz14000: 80 }; 
        break;

      case 'Rock': 
        newBands = { hz60: 75, hz230: 50, hz910: 45, hz3600: 70, hz14000: 70 }; 
        break;

      case 'Pop': 
        newBands = { hz60: 60, hz230: 55, hz910: 65, hz3600: 60, hz14000: 65 }; 
        break;

      case 'Trap': 
        newBands = { hz60: 90, hz230: 65, hz910: 40, hz3600: 50, hz14000: 75 }; 
        break;

      case 'Jazz': 
        newBands = { hz60: 60, hz230: 55, hz910: 50, hz3600: 60, hz14000: 70 }; 
        break;

      case 'Cinema': 
        newBands = { hz60: 70, hz230: 50, hz910: 65, hz3600: 55, hz14000: 60 }; 
        break;

      case 'Podcast': 
        newBands = { hz60: 35, hz230: 60, hz910: 80, hz3600: 60, hz14000: 40 }; 
        break;

      default: 
        console.warn("Preset desconhecido:", type);
        break;
    }

    setBands(newBands);
    
    // Atualiza todas as bandas no nativo de uma vez
    updateNative(0, newBands.hz60);
    updateNative(1, newBands.hz230);
    updateNative(2, newBands.hz910);
    updateNative(3, newBands.hz3600);
    updateNative(4, newBands.hz14000);

  }, [bands, updateNative]);

  return { bands, applyPreset, setManualBand };
};