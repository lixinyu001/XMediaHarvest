import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'

type AboutScreenProps = {
  navigation: StackNavigationProp<any>
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🎬</Text>
          <Text style={styles.appName}>Twitter Media Harvest</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            Twitter Media Harvest is a powerful tool for downloading media from Twitter/X tweets.
            Easily save images and videos from your favorite tweets with just a few taps.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Download images and videos from tweets</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Auto-detect Twitter links from clipboard</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Share directly from Twitter/X app</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Built-in media viewer</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Download history tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Concurrent downloads for speed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.sectionText}>
            • No personal data is collected or transmitted{'\n'}
            • All downloads are stored locally on your device{'\n'}
            • Error logs are stored locally and never uploaded{'\n'}
            • No tracking or analytics
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL('https://github.com')}
          >
            <Text style={styles.linkText}>GitHub Repository</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL('mailto:support@example.com')}
          >
            <Text style={styles.linkText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License</Text>
          <Text style={styles.sectionText}>
            This project is open source and available under the MIT License.
          </Text>
        </View>

        <Text style={styles.footer}>
          Made with ❤️ for the Twitter/X community
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15202B',
  },
  content: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 64,
    marginBottom: 15,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#8899A6',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: '#8899A6',
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 18,
    color: '#17BF63',
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: '#8899A6',
    lineHeight: 22,
  },
  linkButton: {
    backgroundColor: '#202336',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  linkText: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#657786',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 30,
  },
})
