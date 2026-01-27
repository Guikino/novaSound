import { useState } from 'react';
import { NativeModules } from 'react-native';

const { AudioBoostModule } = NativeModules;

export const useAudioBoost = () => {
  const [boost, setBoost] = useState(0);

  const updateBoost = (value: number) => {
    setBoost(value);
    if (AudioBoostModule) {
      AudioBoostModule.setSoftwareGain(value);
    }
  };

  return { boost, updateBoost };
};