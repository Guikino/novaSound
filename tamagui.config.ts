import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'
import { createAnimations } from '@tamagui/animations-react-native' // Adicione isso

const animations = createAnimations({

  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  fluid: {
    type: 'spring',
    damping: 25,    
    stiffness: 80,  
    mass: 1.5,     
  },

  slow: {
    type: 'spring',
    damping: 30,
    stiffness: 40,
  }
})

export const config = createTamagui({
  ...defaultConfig,
  animations, // Injeta as animações aqui
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}