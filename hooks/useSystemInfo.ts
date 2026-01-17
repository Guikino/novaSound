import { useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';

// Extrai o módulo nativo com segurança
const { SystemModule } = NativeModules;

export const useSystemInfo = () => {
  const [appVersion, setAppVersion] = useState<string>('-');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      if (Platform.OS === 'android' && SystemModule) {
        try {
          // Chama o método nativo que criamos no SystemModule.kt
          const version = await SystemModule.getAppVersion();
          setAppVersion(version);
        } catch (error) {
          console.warn("Falha ao obter versão do app:", error);
          setAppVersion("Desconhecido");
        }
      } else {
        // Fallback para iOS ou Web (caso rode fora do Android)
        setAppVersion("1.0.0 (Dev)");
      }
      setLoading(false);
    };

    fetchSystemInfo();
  }, []);

  return { 
    appVersion, 
    loading 
  };
};