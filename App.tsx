import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { AlarmScreen } from './src/screens/AlarmScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#111',
            borderTopColor: '#1e1e1e',
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarActiveTintColor: '#f4a261',
          tabBarInactiveTintColor: '#555',
          tabBarLabelStyle: { fontSize: 11, letterSpacing: 0.5 },
        }}
      >
        <Tab.Screen
          name="Clock"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>☀️</Text>,
          }}
        />
        <Tab.Screen
          name="Alarms"
          component={AlarmScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔔</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
