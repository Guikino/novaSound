import React, { useState } from "react";
import { ScrollView, Pressable, TextInput } from "react-native";
import { YStack, XStack, Text, Button, Stack as TamaguiStack } from "tamagui"; 
import { Sliders, Sparkles } from "@tamagui/lucide-icons";
import { LinearGradient } from '@tamagui/linear-gradient';
import { Slider } from '@miblanchard/react-native-slider'; // <--- A BIBLIOTECA MÁGICA

import { useEqualizer } from "../hooks/useEqualizer"; 

// === COMPONENTE SLIDER USANDO A BIBLIOTECA PRONTA ===
const EQSlider = ({ 
    value, 
    label, 
    onChange,
    onScrollToggle 
}: { 
    value: number; 
    label: string; 
    onChange: (val: number) => void;
    onScrollToggle: (enabled: boolean) => void;
}) => (
  <YStack items="center" gap="$2" height={200} width={60} justify="flex-end">
    
    {/* Container para dar altura ao slider vertical */}
    <YStack height={160} width={40} alignItems="center" justifyContent="center">
        <Slider
            value={value}
            onValueChange={(vals) => onChange(vals[0])}
            
            // 1. O PULO DO GATO: Suporte nativo a vertical
            vertical={true}
            
            minimumValue={0}
            maximumValue={100}
            step={1}
            
            // 2. Cores e Estilos
            minimumTrackTintColor="#2b7de9" // Azul (cor preenchida)
            maximumTrackTintColor="#333333" // Cinza escuro (fundo)
            thumbTintColor="#ffffff"        // Bolinha branca
            
            // 3. Estilização da trilha e da bolinha
            trackStyle={{ width: 180, height: 6, borderRadius: 4 }}
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
                elevation: 5,
            }}
            
            // 4. Controle de Scroll da Tela (Continua necessário)
            onSlidingStart={() => onScrollToggle(false)}
            onSlidingComplete={() => onScrollToggle(true)}
        />
    </YStack>

    <Text color="$gray9" fontSize={12} fontWeight="600" mt="$2">{label}</Text>
  </YStack>
);

interface EqualizerProps {
    variant?: 'solid' | 'gradient';
    onScrollToggle?: (enabled: boolean) => void;
}

export default function Equalizer({ variant = "solid", onScrollToggle }: EqualizerProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const { bands, applyPreset, setManualBand } = useEqualizer();

  const handleScrollToggle = (enabled: boolean) => {
    if (onScrollToggle) {
        if (enabled) setTimeout(() => onScrollToggle(true), 100);
        else onScrollToggle(false);
    }
  };

  const PRESETS = ["Balanced", "Gamer", "Bass", "Rock", "Podcast", "Cinema", "Jazz"];

  return (
    <YStack gap="$3" mt="$4">
      <XStack px="$2" gap="$2" items="center">
        <Sliders size={16} color="$gray11" />
        <Text color="$gray11" fontWeight="800" fontSize={12} letterSpacing={1.5} textTransform="uppercase">
          Sound Personalization
        </Text>
      </XStack>

      <YStack
        bg={variant === 'gradient' ? 'transparent' : '#121212'}
        borderRadius="$6"
        p="$4"
        gap="$5"
        borderWidth={1}
        borderColor="$gray4"
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
         
      
        <XStack justify="space-between" px="$1" height={210} alignItems="center">
          <EQSlider 
            value={bands.hz60} 
            label="Bass" 
            onChange={(val) => setManualBand('hz60', val)} 
            onScrollToggle={handleScrollToggle}
          />
          <EQSlider 
            value={bands.hz230} 
            label="Warmth" 
            onChange={(val) => setManualBand('hz230', val)}
            onScrollToggle={handleScrollToggle}
          />
          <EQSlider 
            value={bands.hz910} 
            label="Vocals" 
            onChange={(val) => setManualBand('hz910', val)}
            onScrollToggle={handleScrollToggle}
          />
          <EQSlider 
            value={bands.hz3600} 
            label="Clarity" 
            onChange={(val) => setManualBand('hz3600', val)}
            onScrollToggle={handleScrollToggle}
          />
          <EQSlider 
            value={bands.hz14000} 
            label="Treble" 
            onChange={(val) => setManualBand('hz14000', val)}
            onScrollToggle={handleScrollToggle}
          />
        </XStack>

        {/* Input IA */}
        <XStack bg="#000" borderRadius="$10" items="center" borderWidth={1} borderColor="$gray6" pl="$3" pr="$1" py="$1">
         <TextInput
            style={{ flex: 1, backgroundColor: 'transparent', color: 'white', fontSize: 14, paddingVertical: 8 }}
            placeholder="Ask AI to EQ..."
            value={aiPrompt}
            onChangeText={setAiPrompt}
            placeholderTextColor="#666"
         />
          <Button
            size="$3"
            circular
            bg="$blue10"
            icon={<Sparkles size={16} color="white" fill="white" />}
            onPress={() => console.log("AI Prompt:", aiPrompt)}
            pressStyle={{ scale: 0.9, opacity: 0.8 }}
          />
        </XStack>

        {/* Presets */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack  gap="$2">
            {PRESETS.map((preset) => (
              <Button  >
                <TamaguiStack
                onPress={() => applyPreset(preset)}
                key={preset}
                  bg="$gray4"
                  px="$3"
                  py="$1"
                  borderRadius="$10"
                  pressStyle={{ bg: "$gray6" }}
                >
                  <Text color="$gray11" fontSize={13} fontWeight="500">
                    {preset}
                  </Text>
                </TamaguiStack>
              </Button>
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    </YStack>
  );
}