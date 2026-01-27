import React from 'react'
import { AudioWaveform, Search, Square, AlertTriangle } from '@tamagui/lucide-icons'
import { Button, Text, YStack, XStack, AlertDialog, Separator } from 'tamagui'
import { Card, CardContent, CardHeader, CardTitle } from 'components/Card' 
import { Slider } from '@miblanchard/react-native-slider'
import { useFindMyBuds } from 'hooks/useFindMyBuds'
import { useAudioBoost } from 'hooks/useAudioBoost'

export default function Configure() {
  const [volDistortion, setVolDistortion] = React.useState<number>(0)
  const { isBeeping, startBeeping, stopBeeping } = useFindMyBuds()
  const { boost, updateBoost } = useAudioBoost();

  return (
    <YStack p="$4" gap={12}>

      {/* CARD FIND MY BUDS */}
      <Card>
        <CardContent items="center" paddingVertical="$2">
          <YStack gap="$1" flex={1}>
            <XStack gap="$2" items="center">
              <Search size={20} color="white" />
              <Text fontSize={18} fontWeight="800" color="white">
                Find My Buds
              </Text>
            </XStack>
            
            <Text fontWeight={200} color={isBeeping ? "$red10" : "$color10"} fontSize={14} marginLeft={28}>
              {isBeeping ? "Playing sound..." : "Plays a high frequency sound."}
            </Text>
          </YStack>

          {isBeeping ? (
            <Button 
              circular 
              size="$5" 
              backgroundColor="$red10"
              onPress={stopBeeping}
              pressStyle={{ opacity: 0.8 }}
              icon={<Square size={24} color="white" fill="white" />}
            />
          ) : (
            <AlertDialog>
              <AlertDialog.Trigger asChild>
                <Button 
                  circular 
                  size="$5" 
                  bg="$color4"
                  icon={<AudioWaveform size={24} color="white" />}
                />
              </AlertDialog.Trigger>

              <AlertDialog.Portal>
                <AlertDialog.Overlay
                  key="overlay"
                  animation="quick"
                  opacity={0.5}
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                  backgroundColor="black"
                />

                <AlertDialog.Content
                  bordered
                  elevate
                  key="content"
                  animation={[
                    'quick',
                    {
                      opacity: { overshootClamping: true },
                    },
                  ]}
                  enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                  exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                  x={0}
                  scale={1}
                  opacity={1}
                  y={0}
                  width={320}
                  bg="$background"
                >
                  <YStack >
                    <XStack gap="$2" alignItems="center">
                      <AlertTriangle size={24} color="$red10" />
                      <AlertDialog.Title fontSize={24} color="$red10" fontWeight="bold">
                        Warning
                      </AlertDialog.Title>
                    </XStack>
                    
                    <Separator />

                    <AlertDialog.Description color="$color11">
                      This will play at a very high volume.
                      {'\n\n'}
                      lease ensure you are <Text fontWeight="bold" color="$red10">NOT</Text> wearing your headphones.
                    </AlertDialog.Description>

                    <XStack gap="$3" justifyContent="flex-end">
                      <AlertDialog.Cancel asChild>
                        <Button chromeless color="$color10">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>

                      <AlertDialog.Action asChild>
                        <Button 
                           theme="active"
                          bg="$red10" 
                          onPress={() => {
                              startBeeping();
                          }}
                        >
                          Play sound
                        </Button>
                      </AlertDialog.Action>
                    </XStack>
                  </YStack>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog>
          )}

        </CardContent>
      </Card>
      {/*CARD BLUETOOTH CODEC */}
      <Card>
        <CardHeader>
          <CardTitle textTransform='uppercase' fontSize={14} color="$color11">Bluetooth Codec</CardTitle>
        </CardHeader>
        <CardContent flexDirection='column'>
            <XStack gap={8}>
              <Button bg={"$color1"}><Text>AAC</Text></Button>
              <Button bg={"$color1"}><Text>SBC</Text></Button>
              <Button bg={"$color1"}><Text>LDAC</Text></Button>
            </XStack>
            <Text fontWeight={200} color={'$color10'}>Note: Available Codec depends on your Android/IOS settings</Text>
        </CardContent>
      </Card>

      {/*CARD BOOST */}
      <Card>
      <CardHeader flexDirection='row' justifyContent="space-between" alignItems="center">
        <YStack>
          <Text fontSize={14} fontWeight={800} textTransform='uppercase' color="$color11">
            Software gain boost
          </Text>
          <Text fontSize={11} color="$color9">Advanced Audio Processing</Text>
        </YStack>
        {boost > 70 && (
          <Text 
            bg="$red6" 
            color={"$red10"} 
            py="$1" 
            px="$2" 
            rounded={3} 
            fontSize={10} 
            fontWeight="700"
            animation="quick"
          >
            Risk of distortion
          </Text>
        )}
      </CardHeader>

      <CardContent flexDirection='column'>
        <Slider 
          value={[boost]}
          onValueChange={(val) => updateBoost(val[0])}
          minimumValue={0} 
          maximumValue={100} 
          step={1}
          minimumTrackTintColor={boost > 75 ? "#ff4444" : "#2b7de9"} 
          maximumTrackTintColor="#333333" 
          thumbTintColor="#ffffff"
          trackStyle={{ width: '100%', height: 6, borderRadius: 4 }}
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
            elevation: 5 
          }}
        />

        <XStack justifyContent="space-between" alignItems="center" mt="$2">
           <Text color={"$color7"} fontSize={13} fontWeight="700">
             {boost}%
           </Text>
           
           <XStack items="center" gap="$1.5">
              <Text color="$color8" fontSize={10} textTransform="uppercase">Gain:</Text>
              <Text 
                color={boost > 75 ? "$red10" : "$color7"} 
                fontSize={14} 
                fontWeight="800"
              >
                +{((boost / 100) * 20).toFixed(1)}dB
              </Text>
           </XStack>
        </XStack>
      </CardContent>
    </Card>
    </YStack>
  )
}