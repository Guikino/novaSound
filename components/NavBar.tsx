import { Cog, Headset, SlidersHorizontal } from '@tamagui/lucide-icons'
import { Link, usePathname } from 'expo-router' // Importe o usePathname
import React from 'react'
import { XStack, YStack } from 'tamagui'

interface NavBarProps {
    path: string
}

export default function NavBar({path}: NavBarProps) {
    const pathname = usePathname()

    const items = [
        { id: '1', icon: Headset, link: '/' },
        { id: '2', icon: SlidersHorizontal, link: '/controls' },
        { id: '3', icon: Cog, link: '/controls'     } 
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
            zIndex={1000} // Importante para garantir que fique sobre o conteúdo
            // Sombras
            elevation={10} 
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 5 }}
            shadowOpacity={0.3}
            shadowRadius={10}
        >
            {items.map((item) => {
                const isActive = pathname === item.link
                
                return (
                    
                    <Link key={item.id} href={item.link as any} asChild replace>
                        <YStack 
                            items="center" 
                            justifyContent="center"
                            py="$2"
                            px="$4" 
                            borderRadius="$4"
                            pressStyle={{ opacity: 0.5, scale: 0.95 }} 
                            animation="quick"
                            backgroundColor={isActive ? '$gray2' : 'transparent'}
                        >
                            <item.icon 
                                size={24} 
                                color={path === item.link ? "$blue10" : "$gray10"} 
                            />
                        </YStack>
                    </Link>
                )
            })}
        </XStack>
    )
}