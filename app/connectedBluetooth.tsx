import React from 'react';
import { YStack, Text, Button, Spinner, H2 } from 'tamagui';
import useAudioOutput from 'hooks/useAudioOutput';
import { Bluetooth } from '@tamagui/lucide-icons'; // Ícone opcional

export default function ConnectedBluetooth() {
  const { isHeadsetConnected, isLoading, checkConnection, requestConnection, hasPermission} = useAudioOutput();

  return (
    <YStack flex={1} bg="$background" justify="center" items="center" p="$4" space="$4">
      
      <Bluetooth size={64} color="$blue9" />
      
      <H2 text="center">
        Conexão Necessária
      </H2>

      <Text textAlign="center" color="$gray11">
        Para usar o aplicativo, você precisa conectar um fone de ouvido Bluetooth ou uma caixa de som.
      </Text>

      {!hasPermission && (
        
      <Button 
        onPress={checkConnection} 
        size="$5" 
        themeInverse
        disabled={isLoading}
        icon={isLoading ? <Spinner /> : undefined}
      >
        {isLoading ? "Verificando..." : "Conectar e Verificar"}
      </Button>
  )}

    
      {!isHeadsetConnected && !isLoading && (
        <Text fontSize="$2" color="$color7" text="center" mt="$4">
          Certifique-se que o Bluetooth do celular está ligado.
        </Text>
      )}

    </YStack>
  );
}