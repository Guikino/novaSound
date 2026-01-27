import { useEffect, useState } from "react";
import { Platform, Alert, PermissionsAndroid } from "react-native";
import { Stack } from "expo-router";
import { ScrollView, Text, XStack, YStack, Button } from "tamagui"; 
import {
  Bluetooth,
  Mic,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Wind,
} from "@tamagui/lucide-icons";
import { Slider } from '@miblanchard/react-native-slider';

// --- IMPORTS DOS COMPONENTES ---
import useAudioOutput from "../hooks/useAudioOutput";
import ControlButton from "components/ControlButton";
import Equalizer from "components/Equalizer"; 

// Importação Atualizada do Card (Verifique o caminho do arquivo)
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "components/Card"; 

import { useVolume } from "hooks/useVolume";
import { useMusicControl } from "hooks/useMusicControl";

export default function Index() {
  const { isHeadsetConnected, deviceName } = useAudioOutput();
  const [activeMode, setActiveMode] = useState("OFF");
  
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  
  const { volume, updateVolume } = useVolume();
  const { togglePlay, next, prev, openPermissionSettings, checkMediaActive, isPermissionGranted, getIsPlaying} = useMusicControl();

  // --- EFEITOS (Lógica mantida) ---
  useEffect(() => {
    async function init() {
      if (Platform.OS === "android" && Platform.Version >= 31) {
        try {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
        } catch (err) { console.warn(err); }
      }

      const permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        Alert.alert(
          "Permissão Necessária",
          "Para acesso ao player de música, ative o 'Acesso a Notificações' para o NovaSound.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir Configurações", onPress: () => openPermissionSettings() },
          ]
        );
      }
    }
    init();
  }, []);

  useEffect(() => {
    const syncStatus = async () => {
      const isActive = await checkMediaActive();
      setShowPlayer(isActive);

      if (isActive) {
        const playing = await getIsPlaying();
        setMusicPlaying(playing); 
      }
    };
    syncStatus();
    const interval = setInterval(syncStatus, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <YStack flex={1} bg="$background">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled} 
      >
        <YStack p="$4" gap="$4" pb="$20">
          
          {/* --------------------------------------------------------- */}
          {/* CARD CONEXÃO (REFATORADO)                                 */}
          {/* --------------------------------------------------------- */}
          <Card 
            variant="gradient" 
            decorativeIcon={<Bluetooth size={120} color="white" />}
          >
            <CardHeader>
              <CardTitle>
                {isHeadsetConnected ? deviceName ?? "No device connected" : "No device connected"}
              </CardTitle>
              <CardDescription>
                {isHeadsetConnected && deviceName ?  "Connected" : "Disconnected"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <XStack gap="$3" width="100%" justifyContent="space-between">
                <ControlButton icon={Mic} label="ANC" active={activeMode === "ANC"} onPress={() => setActiveMode("ANC")} />
                <ControlButton icon={Wind} label="Ambient" active={activeMode === "AMBIENT"} onPress={() => setActiveMode("AMBIENT")} />
                <ControlButton icon={VolumeX} label="Off" active={activeMode === "OFF"} onPress={() => setActiveMode("OFF")} />
              </XStack>
            </CardContent>
          </Card>


          {/* --------------------------------------------------------- */}
          {/* SEÇÃO NOW PLAYING (REFATORADO)                            */}
          {/* --------------------------------------------------------- */}
          {showPlayer && (
            <YStack gap="$2" mt="$2">
              <XStack px="$2" gap="$2" alignItems="center">
                <Music size={16} color="$color9" />
                <Text color="$color9" fontWeight="800" fontSize={14} letterSpacing={1.5} textTransform="uppercase">
                  Now Playing
                </Text>
              </XStack>

              <Card variant="gradient">
                {/* Override no justifyContent para centralizar os botões */}
                <CardContent justifyContent="center" paddingVertical="$4">
                  <XStack gap="$3" alignItems="center">
                    
                    {/* Botão Previous */}
                    <Button circular size={60} bg="transparent" borderColor="$blue10" borderWidth={2} onPress={() => prev()}>
                        <SkipBack size={40} color="white" />
                    </Button>

                    {/* Botão Play/Pause */}
                    <YStack
                      bg="white"
                      animation="quick"
                      onPress={() => {
                        setMusicPlaying(!musicPlaying);
                        togglePlay();
                      }}
                      p="$2.5"
                      borderRadius="$10"
                      pressStyle={{ scale: 0.9 }}
                    >
                      {musicPlaying ? (
                        <Pause size={40} color="black" fill="black" />
                      ) : (
                        <Play size={40} color="black" fill="black" />
                      )}
                    </YStack>

                    {/* Botão Next */}
                    <Button circular size={60} bg="transparent" borderColor="$blue10" borderWidth={2} onPress={() => next()}>
                        <SkipForward size={40} color="white" />
                    </Button>

                  </XStack>
                </CardContent>
              </Card>
            </YStack>
          )}

           {/* --------------------------------------------------------- */}
           {/* SEÇÃO VOLUME (MANTIDO)                                    */}
           {/* --------------------------------------------------------- */}
          <YStack gap="$2" mt="$2" px="$2" >
            <XStack px="$2" gap="$2" alignItems="center">
              <Volume2 size={16} color="$color9" />
              <Text color="$color9" fontWeight="800" fontSize={14} letterSpacing={1.5} textTransform="uppercase">
                Volume {Math.round((volume || 0) * 100)}%
              </Text>
            </XStack>
            <Slider
                value={[Math.round((volume || 0) * 100)]}
                onValueChange={(val) => {
                    if (val && val.length > 0) {
                        const newVol = val[0] / 100;
                        updateVolume(newVol);
                    }
                }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                minimumTrackTintColor="#2b7de9" 
                maximumTrackTintColor="#333333"
                thumbTintColor="#ffffff"
                trackStyle={{ width: "100%", height: 6, borderRadius: 4 }}
                thumbStyle={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: 12, 
                    borderWidth: 1, 
                    borderColor: '#cccccc',
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            />
          </YStack>

          {/* COMPONENTE DE EQUALIZADOR */}
          {/* Nota: Se você refatorou o Equalizer para usar o Card novo internamente, ele continuará funcionando aqui */}
          <Equalizer 
            variant="gradient" 
            onScrollToggle={setScrollEnabled}
          />

        </YStack>
      </ScrollView>
    </YStack>
  );
}