import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, StyleSheet } from 'react-native'
import HomeScreen from '../screens/HomeScreen'
import DownloadHistoryScreen from '../screens/DownloadHistoryScreen'

const Tab = createBottomTabNavigator()

function TabBarIcon({ focused, name }: { focused: boolean; name: string }) {
  return (
    <View style={styles.iconContainer}>
      {name === 'Home' && (
        <Text style={[styles.icon, focused && styles.iconActive]}>🏠</Text>
      )}
      {name === 'History' && (
        <Text style={[styles.icon, focused && styles.iconActive]}>📋</Text>
      )}
      <Text style={[styles.label, focused && styles.labelActive]}>
        {name === 'Home' ? 'Home' : 'History'}
      </Text>
    </View>
  )
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#202336',
          borderTopColor: '#38444D',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 5,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#1DA1F2',
        tabBarInactiveTintColor: '#8899A6',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="Home" />,
        }}
      />
      <Tab.Screen
        name="History"
        component={DownloadHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="History" />,
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: 'bold',
  },
})
