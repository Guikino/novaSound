import {  Cog, Headset, SlidersHorizontal } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { Text, XStack, YStack } from 'tamagui'

export default function NavBar() {
    const [activeTab, setActiveTab] = useState('1')

    const items = [
        { id: '1', icon: Headset  },
        { id: '2', icon: SlidersHorizontal},
        { id: '3', icon: Cog }
    ]

    return (
        <XStack 
            position='absolute'
            bottom={25}
            alignSelf="center" 
            backgroundColor="#121212" 
            borderRadius={100} 
            borderWidth={1} 
            borderColor="$gray3"
            paddingVertical="$2"
            paddingHorizontal="$4"
            justifyContent="space-around" 
            width="90%" 
            elevation={10} 
            shadowColor="#000" // Sombra para o iOS
            shadowOffset={{ width: 0, height: 5 }}
            shadowOpacity={0.3}
            shadowRadius={10}
        >
            {items.map((item) => {
                const isActive = activeTab === item.id
                
                return (
                    <YStack 
                        key={item.id}
                        onPress={() => setActiveTab(item.id)}
                        items="center" 
                        py="$2"
                        flex={1}
                        pressStyle={{ opacity: 0.5, scale: 0.95 }} 
                        animation="quick" 
                    >
                        <item.icon 
                            size={25} 
                            color={isActive ? "$blue10" : "$gray10"} 
                        />
                       
                    </YStack>
                )
            })}
        </XStack>
    )
}