import { NativeModules, Platform } from 'react-native';

const { MediaModule } = NativeModules;

export interface TrackInfo {
  title: string;
  artist: string;
  artwork: string | null; 
}

export const useMusicControl = () => {
  const togglePlay = () => MediaModule?.playPause();
  const next = () => MediaModule?.skipToNext();
  const prev = () => MediaModule?.skipToPrevious();

  const openPermissionSettings = () => {
    if (Platform.OS === 'android') {
      MediaModule?.requestPermission();
    }
  };

  const isPermissionGranted = async () => {
    if (Platform.OS === 'android') {
      return await MediaModule?.checkPermission();
    }
    return true;
  };

  // --- NOVA FUNÇÃO ---
  const checkMediaActive = async (): Promise<boolean> => {
    if (Platform.OS === 'android' && MediaModule) {
      return await MediaModule.isMediaActive();
    }
    return false;
  };
  const getIsPlaying = async (): Promise<boolean> => {
    if (Platform.OS === 'android' && MediaModule) {
      const status = await MediaModule.getPlaybackState();
      return status === "PLAYING";
    }
    return false;
  };
  
  

  return { togglePlay, next, prev, openPermissionSettings, isPermissionGranted, checkMediaActive, getIsPlaying };
};