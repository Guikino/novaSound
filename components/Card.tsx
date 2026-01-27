import React from 'react'
import { Text, View, YStack, XStack, StackProps, TextProps } from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'
interface CardProps extends StackProps {
  variant?: 'solid' | 'gradient'
  decorativeIcon?: React.ReactNode
}

const Card = React.forwardRef<View, CardProps>(
  ({ variant = 'solid', decorativeIcon, children, ...props }, ref) => {
    return (
      <YStack
        ref={ref}
        // CSS ORIGINAL
        bg={variant === 'gradient' ? 'transparent' : '#121212'}
        borderRadius="$8"
       
        padding="$5"
        gap="$4"
        position="relative"
        overflow="hidden"
        width="100%"
        maxWidth={500}
        {...props}
      >

        {variant === 'gradient' && (
          <LinearGradient
            colors={['#1e1e1e', '#000000']}
            start={[0, 0]}
            end={[1, 1]}
            fullscreen
            borderRadius="$8"
          />
        )}
        {decorativeIcon && (
          <View
            position="absolute"
            right={-10}
            top={10}
            opacity={0.15}
            scale={2.5}
            rotate="15deg"
            zIndex={0}
          >
            {decorativeIcon}
          </View>
        )}
        <YStack zIndex={1} gap="$4">
          {children}
        </YStack>
      </YStack>
    )
  }
)
Card.displayName = 'Card'
const CardHeader = React.forwardRef<View, StackProps>((props, ref) => (
  <YStack ref={ref} gap="$1" {...props} />
))
CardHeader.displayName = 'CardHeader'
const CardTitle = React.forwardRef<Text, TextProps>((props, ref) => (
  <>
  
  <Text
    ref={ref}
    color="white"
    fontSize={28}
    fontWeight="800"
    {...props}
    
  />
  </>
))
CardTitle.displayName = 'CardTitle'

interface CardDescriptionProps extends StackProps {
  hasDot?: boolean
  icon?: React.ReactNode
}

const CardDescription = React.forwardRef<View, CardDescriptionProps>(
  ({ children, hasDot = true, icon, ...props }, ref) => {
    return (
      <XStack ref={ref} items="center" gap="$2" {...props}>

        {hasDot && (
          <View width={8} height={8} borderRadius={4} backgroundColor="$blue10" />
        )}
        <Text color="white" {...props} fontSize={16} fontWeight="500">
          {children}
        </Text>
      </XStack>
    )
  }
)
CardDescription.displayName = 'CardDescription'

/* -------------------------------------------------------------------------- */
/* 5. CONTENT (Área dos botões)                                               */
/* -------------------------------------------------------------------------- */

const CardContent = React.forwardRef<View, StackProps>((props, ref) => (
  // CSS ORIGINAL: <XStack gap="$3" justifyContent="space-between" mt="$2">
  <XStack
    ref={ref}
    gap="$3"
    justifyContent="space-between"
    marginTop="$2"
    {...props}
  />
))
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardDescription, CardContent }