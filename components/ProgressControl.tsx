import React, { useState } from "react";
import { Slider, XStack, YStack, Text } from "tamagui";
import { Volume2 } from "@tamagui/lucide-icons";

export default function ProgressControl({
  label = "Volume",
  initialValue = 0,
}) {
  const [value, setValue] = useState([initialValue]);

  return (
    <YStack width="100%" gap="$2" px="$4" py="$2">
      <XStack justifyContent="flex-end" items="center">
        <Text color="white" fontSize={24} text="right" fontWeight="800">
          {value[0]}%
        </Text>
      </XStack>

      
      <Slider
        size="$4"
        width="100%"
        value={value}
        onValueChange={setValue}
        max={100}
        step={1}
        minHeight={40}
      >
        <Slider.Track backgroundColor="#2a2a2a" height={6}>
          <Slider.TrackActive backgroundColor="$blue10" />
        </Slider.Track>

        <Slider.Thumb
          index={0}
          circular
          size={20}
          bg="$blue10"
          borderWidth={2}
          borderColor="$blue8"
          elevation="$4"
          focusStyle={{
            scale: 1.2,
            outlineColor: "$blue8",
            outlineWidth: 2,
          }}
        />
      </Slider>
    </YStack>
  );
}
