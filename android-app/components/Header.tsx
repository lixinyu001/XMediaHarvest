import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MoreMenu from '../components/MoreMenu'

interface HeaderProps {
  title: string
  onSettings: () => void
  onErrorLogs: () => void
  onAbout: () => void
}

export default function Header({ title, onSettings, onErrorLogs, onAbout }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setShowMenu(true)}
      >
        <Text style={styles.moreIcon}>⋮</Text>
      </TouchableOpacity>

      <MoreMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onSettings={() => {
          setShowMenu(false)
          onSettings()
        }}
        onErrorLogs={() => {
          setShowMenu(false)
          onErrorLogs()
        }}
        onAbout={() => {
          setShowMenu(false)
          onAbout()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#15202B',
    borderBottomWidth: 1,
    borderBottomColor: '#38444D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#202336',
  },
  moreIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 28,
  },
})
