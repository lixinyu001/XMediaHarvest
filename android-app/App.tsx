import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MainTabs from './navigation/MainTabs'
import TweetDetailScreen from './screens/TweetDetailScreen'
import SettingsScreen from './screens/SettingsScreen'
import ErrorLogsScreen from './screens/ErrorLogsScreen'
import AboutScreen from './screens/AboutScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TweetDetail"
            component={TweetDetailScreen}
            options={{ 
              headerShown: true,
              headerStyle: {
                backgroundColor: '#1DA1F2',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ 
              headerShown: true,
              headerStyle: {
                backgroundColor: '#1DA1F2',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="ErrorLogs"
            component={ErrorLogsScreen}
            options={{ 
              headerShown: true,
              headerStyle: {
                backgroundColor: '#1DA1F2',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ 
              headerShown: true,
              headerStyle: {
                backgroundColor: '#1DA1F2',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
