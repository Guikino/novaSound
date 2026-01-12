import { Mic, Wind, VolumeX } from '@tamagui/lucide-icons'
import { Text, YStack } from 'tamagui'

const ControlButton = ({ icon: Icon, label, active = false }) => (
  <YStack
    flex={1}
    bg={active ? "$blue10" : "#1a1a1a"}
    padding="$4"
    borderRadius="$6"
    alignItems="center"
    justifyContent="center"
    gap="$2"
    borderWidth={1}
    borderColor={active ? "$blue11" : "#222"}
  >
    <Icon color={active ? "white" : "$gray10"} size={24} />
    <Text color={active ? "white" : "$gray10"} fontSize={12} fontWeight="800" textTransform="uppercase">
      {label}
    </Text>
  </YStack>
)
export default ControlButton