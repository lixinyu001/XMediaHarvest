import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native'

interface MoreMenuProps {
  visible: boolean
  onClose: () => void
  onSettings: () => void
  onErrorLogs: () => void
  onAbout: () => void
}

export default function MoreMenu({ visible, onClose, onSettings, onErrorLogs, onAbout }: MoreMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={onSettings}>
                <Text style={styles.menuIcon}>⚙️</Text>
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={onErrorLogs}>
                <Text style={styles.menuIcon}>📋</Text>
                <Text style={styles.menuText}>Error Logs</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={onAbout}>
                <Text style={styles.menuIcon}>ℹ️</Text>
                <Text style={styles.menuText}>About</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem} onPress={onClose}>
                <Text style={styles.menuIcon}>✖️</Text>
                <Text style={[styles.menuText, styles.menuTextCancel]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#202336',
    borderRadius: 12,
    width: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#38444D',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  menuTextCancel: {
    color: '#E0245E',
  },
  divider: {
    height: 1,
    backgroundColor: '#38444D',
  },
})
