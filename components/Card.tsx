import React from 'react'
import { Text, View, YStack, XStack } from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient' // Certifique-se de ter instalado

interface CardProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  content?: React.ReactNode
  variant?: 'solid' | 'gradient' // Adicionei uma variante opcional
}

export default function Card({ title, content, subtitle, icon, variant = 'solid' }: CardProps) {
  return (
    <YStack
      // Se for variante gradient, o fundo do YStack deve ser transparente
      bg={variant === 'gradient' ? 'transparent' : '#121212'} 
      borderRadius="$8"
      padding="$5"
      gap="$4"
      position="relative"
      overflow="hidden"
      width="100%"
      maxWidth={500}
    >
      {/* GRADIENTE COMO FUNDO */}
      {variant === 'gradient' && (
        <LinearGradient
          colors={['#1e1e1e', '#000000']} // Tons escuros para combinar com a imagem
          start={[0, 0]}
          end={[1, 1]}
          fullscreen
          borderRadius="$8"
        />
      )}

      {/* Ícone de Fundo (Bluetooth) */}
      {icon && (
        <View 
          position="absolute" 
          right={-10} 
          top={10} 
          opacity={0.15} 
          scale={2.5}
          rotate="15deg"
          zIndex={0} // Garante que fique atrás do texto
        >
          {icon}
        </View>
      )}

      {/* Conteúdo (Cabeçalho e Botões) */}
      <YStack zIndex={1} gap="$4"> 
        {/* Cabeçalho */}
        <YStack gap="$1">
          {title && (
            <Text color="white" fontSize={28} fontWeight="800">
              {title}
            </Text>
          )}
          {subtitle && (
            <XStack alignItems="center" gap="$2">
              <View width={8} height={8} borderRadius={4} backgroundColor="$blue10" />
              <Text color="$gray11" fontSize={16} fontWeight="500">
                {subtitle}
              </Text>
            </XStack>
          )}
        </YStack>

        {/* Área dos Botões / Player */}
        {content && (
          <XStack gap="$3" justifyContent="space-between" mt="$2">
            {content}
          </XStack>
        )}
      </YStack>
    </YStack>
  )
}