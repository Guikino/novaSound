import '../tamagui-web.css'
import { useEffect, useState } from 'react'
import { Pressable, useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, usePathname, useRouter, useSegments } from 'expo-router'
import { Provider } from 'components/Provider'
import { Image, Text, Theme, XStack, YStack } from 'tamagui'
import useAudioOutput from 'hooks/useAudioOutput'
import NavBar from 'components/NavBar'
import { Cog, Battery as BatteryIcon} from '@tamagui/lucide-icons'
import { useSystemInfo } from 'hooks/useSystemInfo'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) return null

  return (
    <Provider>
      <RootLayoutNav />
    </Provider>
  )
}

function RootLayoutNav() {
  const { isHeadsetConnected, isLoading, deviceBattery } = useAudioOutput();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname()
  const { appVersion } = useSystemInfo();
  
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(systemColorScheme || 'dark');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    if (isLoading) return; 

    const inBluetoothScreen = segments[0] === 'connectedBluetooth';

    if (!isHeadsetConnected && !inBluetoothScreen) {
      router.replace('/connectedBluetooth');
    } else if (isHeadsetConnected && inBluetoothScreen) {
      router.replace('/');
    }
  }, [isHeadsetConnected, segments, isLoading]);

  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <Theme name={themeMode}>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
        
        <Stack
          screenOptions={{
            animation: 'slide_from_right',
            animationDuration: 200,
            headerStyle: {
              backgroundColor: themeMode === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: themeMode === 'dark' ? '#fff' : '#0F3460',
            headerShown: true,      
          
            

            headerTitle: () => (
                <XStack items="center" gap="$2">
                  <Image
                    source={require("../assets/images/icon.jpeg")}
                    width={28}
                    height={28}
                    borderRadius={6}
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
                <XStack gap="$1" items="center" pr="$2">
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
        > 

          <Stack.Screen 
            name="index" 
            initialParams={{ themeMode, toggleTheme }} 
          />
          <Stack.Screen 
            name="controls" 
          />

     
          <Stack.Screen 
            name="connectedBluetooth" 
            options={{ 
                headerShown: false 
            }} 
          />

         
          <Stack.Screen 
            name="+not-found" 
            options={{ 
                headerShown: true,
                title: 'Oops!',
                headerTitle: undefined,
                headerRight: undefined  
            }} 
          />
          
        </Stack>
        
        <NavBar path={pathname} />

      </Theme>
    </ThemeProvider>
  )
}