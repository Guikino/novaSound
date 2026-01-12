import { Moon, Sun } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { View, Button } from "tamagui";


export default function ButtonTheme({ currentTheme, onToggle }: { currentTheme: string, onToggle: () => void }) {
  return (
    <Button 
      size="$3" 
      circular 
      onPress={onToggle}
      bg="$backgroundHover"
      borderWidth={0}
      hoverStyle={{ scale: 0.9 }}
      pressStyle={{ scale: 1.1 }}
    >
      {currentTheme === 'dark' ? (
        <Sun size={20} color="#FFD700" />
      ) : (
        <Moon size={20} color="#0F3460" />
      )}
    </Button>
  );
}