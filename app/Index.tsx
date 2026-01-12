import { useState } from 'react'
import { Stack } from 'expo-router'
import { ScrollView, Text, View, XStack, YStack, Image } from 'tamagui' 
import { 
  BatteryCharging, 
  Battery as BatteryIcon, 
  Bluetooth, 
  Cog, 
  Headset, 
  Mic, 
  Music, 
  Pause, 
  Play, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Wind 
} from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'

import { useBattery } from '../hooks/useBattery'
import useAudioOutput from '../hooks/useAudioOutput'
import Card from 'components/Card'
import ControlButton from 'components/ControlButton'
import ProgressControl from 'components/ProgressControl'
import NavBar from 'components/NavBar'

export default function Index() {
  const { batteryLevel, isCharging } = useBattery()
  const { isHeadsetConnected, deviceName } = useAudioOutput()
  const [activeMode, setActiveMode] = useState('OFF')
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false)

  return (
    <YStack f={1} bg="$background">
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <XStack items="center" gap="$2">
              <View bg="$blue9" p="$2" borderRadius="$4">
                <Headset color="white" size={20} />
              </View>
              <Text color="$color" fontSize={20} fontWeight="700">NovaSound</Text>
            </XStack>
          ),
          headerRight: () => (
            <XStack gap="$1" items="center">
              <XStack bg="$color5" borderRadius="$true" items="center" gap="$1.5" px="$2" py="$1">
                {!isCharging ? (
                  <BatteryIcon size={14} color={batteryLevel < 20 ? "$red10" : "$color"} />
                ) : (
                  <BatteryCharging size={14} color="$green10"/>
                )}
                <Text fontSize={12} fontWeight="600" color="$color">{batteryLevel}%</Text>
              </XStack>
              <Pressable style={{ padding: 8 }}>
                <Cog size={20} color="$color11" />
              </Pressable>
            </XStack>
          ),
        }} 
      />
      
      <ScrollView  showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$4" pb="$20">
          
          {/* CARD DE STATUS */}
          <Card 
            variant='gradient'
            title={isHeadsetConnected ? deviceName : "No Device Connected"} 
            subtitle={isHeadsetConnected ? "Connected" : "Disconnected"} 
            icon={<Bluetooth size={120} color="white" />}  
            content={
              <XStack gap="$3" width="100%">
                <ControlButton icon={Mic} label="ANC" active={activeMode === 'ANC'} onPress={() => setActiveMode('ANC')} />
                <ControlButton icon={Wind} label="Ambient" active={activeMode === 'AMBIENT'} onPress={() => setActiveMode('AMBIENT')} />
                <ControlButton icon={VolumeX} label="Off" active={activeMode === 'OFF'} onPress={() => setActiveMode('OFF')} />
              </XStack>
            }
          />

          {/* SEÇÃO NOW PLAYING */}
          <YStack gap="$2" mt="$2">
            <XStack px="$2" gap="$2" items="center">
              <Music size={16} color="$gray11" />
              <Text color="$gray11" fontWeight="800" fontSize={14} letterSpacing={1.5} textTransform="uppercase">
                Now Playing
              </Text>
            </XStack>
            
            <Card
              content={
                <XStack items="center" gap="$3" width="100%">
                  <Image source={require('./assets/images/favicon.png')} width={50} height={50} borderRadius="$4" />
                  <YStack flex={1}>
                    <Text color="white" fontSize={16} fontWeight="800" textTransform="uppercase" numberOfLines={1}>
                      Midnight City
                    </Text>
                    <Text color="$gray11" fontSize={13}>M83</Text>
                  </YStack>

                  <XStack gap="$3" items="center">
                    <SkipBack size={22} color="white" />
                    
                  
                    <YStack 
                      backgroundColor="white" 
                      onPress={() => setMusicPlaying(!musicPlaying)} 
                      p="$2.5" 
                      borderRadius="$10"
                      pressStyle={{ scale: 0.9, opacity: 0.8 }} // Adiciona o comportamento tátil
                      animation="quick"
                    >
                      {musicPlaying ? (
                        <Pause size={20} color="black" fill="black" />
                      ) : (
                        <Play size={20} color="black" fill="black" />
                      )}
                    </YStack>

                    <SkipForward size={22} color="white" />
                  </XStack>
                </XStack>
              }
            />
          </YStack>

          {/* SEÇÃO VOLUME */}
          <YStack gap="$2" mt="$2">
            <XStack px="$2" gap="$2" items="center">
              <Volume2 size={16} color="$gray11" />
              <Text color="$gray11" fontWeight="800" fontSize={14} letterSpacing={1.5} textTransform="uppercase">
                Volume
              </Text>
            </XStack>
            <ProgressControl initialValue={50} />
          </YStack>

          <Card variant="gradient" title="Equalizer Profile" subtitle="Dynamic AI Mode" />
          <Card variant="gradient" title="Device Info" subtitle="Firmware v1.2.4" />

        </YStack>
      </ScrollView>

      {/* NavBar fixa no rodapé */}
      <NavBar />
    </YStack>
  )
}