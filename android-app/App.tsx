import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HomeScreen from './screens/HomeScreen'
import TweetDetailScreen from './screens/TweetDetailScreen'
import DownloadHistoryScreen from './screens/DownloadHistoryScreen'
import SettingsScreen from './screens/SettingsScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1DA1F2',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Media Harvest' }}
          />
          <Stack.Screen
            name="TweetDetail"
            component={TweetDetailScreen}
            options={{ title: 'Tweet Detail' }}
          />
          <Stack.Screen
            name="DownloadHistory"
            component={DownloadHistoryScreen}
            options={{ title: 'Download History' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
