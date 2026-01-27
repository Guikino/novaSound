import React, { useState } from 'react'
import { ScrollView, Stack, Text, YStack, XStack, Button, Switch, Separator, Image } from 'tamagui'
import { 
  MousePointerClick, 
  ChevronRight, 
  Gamepad2, 
  Ear,
  Timer
} from '@tamagui/lucide-icons'

// Importe os componentes do arquivo que criamos anteriormente
// Ajuste o caminho conforme sua estrutura de pastas, ex: './components/ui/card'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription, 
  
} from "components/Card"
  

export default function ControlsScreen() {
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left')
  const [earDetection, setEarDetection] = useState(true)
  const [lowLatency, setLowLatency] = useState(false)

  return (
    <YStack flex={1} bg="$background">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ pb: 100 }} 
      >
        <Stack p="$4" gap="$6">
          
          {/* TOPO: Imagem e Texto */}
          <YStack alignItems="center" gap="$2">
            <Image
              width={280} height={220}
              source={require("../assets/images/Music-bro.png")}
            />
            <Text color="$color" textAlign="center" fontSize="$8" fontWeight="800">
              gestures & touches
            </Text>
            <Text color="$color9" textAlign="center" fontSize="$4">
              Personalize a interação com seus fones.
            </Text>
          </YStack>

          {/* SELETOR: Left / Right */}
          <XStack bg="$color3" p="$1" borderRadius="$10">
              <Button 
                  flex={1} 
                  size="$3" 
                  bg={selectedSide === 'left' ? '$blue10' : 'transparent'} 
                  color={selectedSide === 'left' ? 'white' : '$color11'}
                  onPress={() => setSelectedSide('left')}
                  borderRadius="$8"
                  fontWeight="bold"
              >
                  Left (L)
              </Button>
              <Button 
                  flex={1} 
                  size="$3" 
                  bg={selectedSide === 'right' ? '$blue10' : 'transparent'} 
                  color={selectedSide === 'right' ? 'white' : '$color11'}
                  onPress={() => setSelectedSide('right')}
                  borderRadius="$8"
                  fontWeight="bold"
              >
                  Right (R)
              </Button>
          </XStack>

          {/* CARD 1: Configuração de Toques (Refatorado) */}
          <Card 
            variant="gradient" 
            decorativeIcon={<MousePointerClick size={60} color="white" />}
          >
            <CardHeader>
              <CardTitle>Touches ({selectedSide === 'left' ? 'L' : 'R'})</CardTitle>
              <CardDescription>Configure o que cada toque faz</CardDescription>
            </CardHeader>

            <CardContent flexDirection="column" gap={0}>
               <YStack width="100%" gap="$4">
                  <GestureRow 
                      label="1 Touch" 
                      action="Play / Pause" 
                      dots={1}
                  />
                  <Separator borderColor="$gray5" />
                  
                  <GestureRow 
                      label="2 Touches  " 
                      action={selectedSide === 'left' ? 'Voltar Faixa' : 'Próxima Faixa'} 
                      dots={2}
                  />
                  <Separator borderColor="$gray5" />

                  <GestureRow 
                      label="3 Touches" 
                      action="Assistente de Voz" 
                      dots={3}
                  />
                  <Separator borderColor="$gray5" />

                  <GestureRow 
                      label="Press (2s)" 
                      action="Alternar ANC" 
                      dots={0} 
                  />
               </YStack>
            </CardContent>
          </Card>

          <Text fontSize="$6" fontWeight="700" color="$color" mt="$2">Geral</Text>
          
          {/* CARD 2: Configurações Gerais (Refatorado) */}
          <Card variant="solid">
            {/* Este card não tem Header/Title, apenas conteúdo */}
            <CardContent flexDirection="column">
                <YStack width="100%" gap="$4">
                    <SettingRow 
                        icon={<Ear size={20} color="$blue9" />}
                        label="Detecção de Uso"
                        description="Pausar ao tirar do ouvido"
                        value={earDetection}
                        onValueChange={setEarDetection}
                    />
                     <Separator borderColor="$gray4" />
                    <SettingRow 
                        icon={<Gamepad2 size={20} color="$purple9" />}
                        label="Modo Gamer"
                        description="Baixa latência para jogos"
                        value={lowLatency}
                        onValueChange={setLowLatency}
                    />
                </YStack>
            </CardContent>
          </Card>

        </Stack>
      </ScrollView>
    </YStack>
  )
}

/* --- SUBCOMPONENTES (Mantidos iguais) --- */

const GestureRow = ({ label, action, dots }: { label: string, action: string, dots: number }) => (
    <XStack justifyContent="space-between" alignItems="center" pressStyle={{ opacity: 0.5 }}>
        <XStack gap="$3" alignItems="center">
            <XStack width={24} justifyContent="center" gap={3}>
                {dots === 0 ? (
                    <Timer size={16} color="$color9" />
                ) : (
                    Array.from({ length: dots }).map((_, i) => (
                        <Stack key={i} width={5} height={5} borderRadius={5} bg="$blue9" />
                    ))
                )}
            </XStack>
            <Text color="$color11" fontSize="$3" fontWeight="600">{label}</Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
            <Text color="white" fontWeight="600">{action}</Text>
            <ChevronRight size={16} color="$color8" />
        </XStack>
    </XStack>
)

const SettingRow = ({ icon, label, description, value, onValueChange }: any) => (
    <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$3" alignItems="center" flex={1}>
            <Stack bg="$color4" p="$2" borderRadius="$4">
                {icon}
            </Stack>
            <YStack>
                <Text color="$color" fontWeight="700" fontSize="$4">{label}</Text>
                <Text color="$color9" fontSize="$2">{description}</Text>
            </YStack>
        </XStack>
        <Switch size="$3" checked={value} onCheckedChange={onValueChange} backgroundColor={value ? '$blue10' : '$gray8'}>
             <Switch.Thumb animation="quick" />
        </Switch>
    </XStack>
)