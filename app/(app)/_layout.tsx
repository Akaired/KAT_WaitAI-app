import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/theme';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:      false,
        tabBarActiveTintColor:   Colors.magenta,
        tabBarInactiveTintColor: Colors.grayLight,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor:  Colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilo',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
