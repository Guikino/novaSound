import '../tamagui-web.css'

import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from 'components/Provider'
import { Theme } from 'tamagui'

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
  const systemColorScheme = useColorScheme()
  // Estado que manda no tema do app todo
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(systemColorScheme || 'dark')

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

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
          {/* Passamos as propriedades para a tela index via initialParams 
             ou apenas deixamos que o index as use via contexto se necessário.
          */}
          <Stack.Screen 
            name="index" 
            options={{ 
                headerShown: true 
            }} 
            initialParams={{ themeMode, toggleTheme }} 
          />
        </Stack>
      </Theme>
    </ThemeProvider>
  )
}