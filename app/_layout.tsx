import '../tamagui-web.css'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar' // StatusBar restaurada
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { Provider } from 'components/Provider'
import { Theme } from 'tamagui' // Theme restaurado
import useAudioOutput from 'hooks/useAudioOutput'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // 1. Carregamento de Fontes (Restaurado)
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
  const { isHeadsetConnected, isLoading } = useAudioOutput();
  const segments = useSegments();
  const router = useRouter();
  
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(systemColorScheme || 'dark');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // 2. Lógica de Proteção de Rota
  useEffect(() => {
    if (isLoading) return; // Aguarda a primeira verificação do hook

    const inBluetoothScreen = segments[0] === 'connectedBluetooth';

    if (!isHeadsetConnected && !inBluetoothScreen) {
      // Se NÃO tem fone e NÃO está na tela de aviso -> Manda para lá
      router.replace('/connectedBluetooth');
    } else if (isHeadsetConnected && inBluetoothScreen) {
      // Se TEM fone e ESTÁ na tela de aviso -> Libera para a Home
      router.replace('/');
    }
  }, [isHeadsetConnected, segments, isLoading]);

  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <Theme name={themeMode}>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />

        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: themeMode === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: themeMode === 'dark' ? '#fff' : '#0F3460',
          }}
        >
      
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: true,
              title: "index" 
            }} 
            initialParams={{ themeMode, toggleTheme }} 
          />

          
          <Stack.Screen 
            name="connectedBluetooth" 
            options={{ 
                headerShown: false,
                gestureEnabled: false 
            }} 
          />

          <Stack.Screen 
            name="+not-found" 
            options={{ title: 'Oops!' }} 
          />
        </Stack>
        

      </Theme>
    </ThemeProvider>
  )
}