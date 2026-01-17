import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, Text, View, XStack, YStack, Image, Stack as TamaguiStack } from "tamagui"; // Adicionei TamaguiStack para evitar conflito
import {
  Battery as BatteryIcon,
  Bluetooth,
  Cog,
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
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
} from "react-native";

import useAudioOutput from "../hooks/useAudioOutput";
import Card from "components/Card";
import ControlButton from "components/ControlButton";
import ProgressControl from "components/ProgressControl";
import NavBar from "components/NavBar";
import { useVolume } from "hooks/useVolume";
import { useMusicControl } from "hooks/useMusicControl";
import { useSystemInfo } from "hooks/useSystemInfo";

export default function Index() {
  const { isHeadsetConnected, deviceName, deviceBattery } = useAudioOutput();
  const [activeMode, setActiveMode] = useState("OFF");
  

  const [showPlayer, setShowPlayer] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  
  const { volume, updateVolume } = useVolume();
  

  const { togglePlay, next, prev, openPermissionSettings, checkMediaActive, isPermissionGranted, getIsPlaying} = useMusicControl();
const { appVersion } = useSystemInfo();

  useEffect(() => {
    async function init() {
     
      if (Platform.OS === "android" && Platform.Version >= 31) {
        try {

            const permissions = [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ].filter(Boolean);
            
            await PermissionsAndroid.requestMultiple(permissions);
        } catch (err) {
          console.warn(err);
        }
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
      <Stack.Screen
        options={{
          headerTitle: () => (
            <XStack items="center" gap="$2">
              <Image
                source={require("../assets/images/icon.jpeg")}
                width={28}
                height={28}
              />
              <YStack>
                <XStack items="center" gap="$3" >
              <Text color="$color" fontSize={20} fontWeight="700">
                NovaSound
              </Text>
              <Text color="$color8" fontSize={12} fontWeight="600">
                {appVersion}
              </Text>
              </XStack>
               <Text color="$color11">Control Center</Text>
              </YStack>
             
            </XStack>
          ),
          headerRight: () => (
            <XStack gap="$1" items="center">
              <XStack
                bg="$color5"
                borderRadius="$true"
                items="center"
                gap="$1.5"
                px="$2"
                py="$1"
              >
                {deviceBattery !== null && (
                  <BatteryIcon
                    size={14}
                    fill={"green"}
                    color={deviceBattery < 20 ? "$red10" : "$color"}
                  />
                )}
                <Text fontSize={12} fontWeight="600" color="$color">
                  {deviceBattery !== null ? `${deviceBattery}%` : "N/A"}
                </Text>
              </XStack>
              <Pressable style={{ padding: 8 }}>
                <Cog size={20} color="$color11" />
              </Pressable>
            </XStack>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$4" pb="$20">
          
          {/* CARD CONEXÃO */}
          <Card
            variant="gradient"
            title={isHeadsetConnected ? deviceName ?? "Connected Device" : "No device connected"}
            subtitle={isHeadsetConnected ? "Connected" : "Disconnected"}
            icon={<Bluetooth size={120} color="white" />}
            content={
              <XStack gap="$3" width="100%">
                <ControlButton icon={Mic} label="ANC" active={activeMode === "ANC"} onPress={() => setActiveMode("ANC")} />
                <ControlButton icon={Wind} label="Ambient" active={activeMode === "AMBIENT"} onPress={() => setActiveMode("AMBIENT")} />
                <ControlButton icon={VolumeX} label="Off" active={activeMode === "OFF"} onPress={() => setActiveMode("OFF")} />
              </XStack>
            }
          />

          {/* SEÇÃO NOW PLAYING */}
          {showPlayer && (
            <YStack gap="$2" mt="$2">
              <XStack px="$2" gap="$2" items="center">
                <Music size={16} color="$gray11" />
                <Text color="$gray11" fontWeight="800" fontSize={14} letterSpacing={1.5} textTransform="uppercase">
                  Now Playing
                </Text>
              </XStack>

              <Card
                variant="gradient"
                content={
                  <XStack gap="$3" items="center" m="auto">
                    
                    <TamaguiStack 
                        borderWidth={2} borderColor="$blue10" p="$2" borderRadius="$10"
                        animation="quick"
                        pressStyle={{ scale: 0.85, opacity: 0.7, bg: "$blue10" }}
                        onPress={() => prev()}
                    >
                      <SkipBack size={40} color="white" />
                    </TamaguiStack>

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

                    {/* Botão Próximo - Com animação e fundo azul */}
                    <TamaguiStack 
                        borderWidth={2} borderColor="$blue10" p="$2" borderRadius="$10"
                        animation="quick"
                        pressStyle={{ scale: 0.85, opacity: 0.7, bg: "$blue10" }}
                        onPress={() => next()}
                    >
                      <SkipForward size={40} color="white" />
                    </TamaguiStack>
                  </XStack>
                }
              />
            </YStack>
          )}

          {/* SEÇÃO VOLUME */}
          <YStack gap="$2" mt="$2">
            <XStack px="$2" gap="$2" items="center">
              <Volume2 size={16} color="$gray11" />
              <Text color="$gray11" fontWeight="800" fontSize={14} letterSpacing={1.5} textTransform="uppercase">
                Volume {Math.round((volume || 0) * 100)}%
              </Text>
            </XStack>

            <ProgressControl
              value={[Math.round((volume || 0) * 100)]}
              onValueChange={(val) => {
                if (val && val.length > 0) {
                    const newVol = val[0] / 100;
                    updateVolume(newVol);
                }
              }}
            />
          </YStack>

          <Card variant="gradient" title="Equalizer Profile" subtitle="Dynamic AI Mode" />
          <Card variant="gradient" title="Device Info" subtitle="Firmware v1.2.4" />
        </YStack>
      </ScrollView>

      <NavBar />
    </YStack>
  );
}