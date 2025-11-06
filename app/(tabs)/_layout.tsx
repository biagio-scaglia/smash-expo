import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const nintendoRed = '#E60012';
  const white = '#FFFFFF';
  const inactiveIconColor = '#999999'; // Grigio per icone non selezionate (bianco su bianco non si vede)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: nintendoRed,
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: white,
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name="home" 
              size={24} 
              color={focused ? nintendoRed : inactiveIconColor} 
              solid={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Personaggi',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name="users" 
              size={24} 
              color={focused ? nintendoRed : inactiveIconColor} 
              solid={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name="user" 
              size={24} 
              color={focused ? nintendoRed : inactiveIconColor} 
              solid={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilo',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name="id-card" 
              size={24} 
              color={focused ? nintendoRed : inactiveIconColor} 
              solid={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lobby"
        options={{
          title: 'Lobby',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name="users-cog" 
              size={24} 
              color={focused ? nintendoRed : inactiveIconColor} 
              solid={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
