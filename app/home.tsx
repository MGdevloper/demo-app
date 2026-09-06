import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { BackHandler, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSavedUser } from '../authentication.config.js';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [userName, setUserName] = React.useState('there');
  const [profilePicture, setProfilePicture] = React.useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      getSavedUser().then((user) => {
        if (user?.name) {
          setUserName(user.name.split(' ')[0]);
        }
        setProfilePicture(user?.picture || null);
      });

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          BackHandler.exitApp();
          return true;
        }
      );

      return () => subscription.remove();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>CHARUSAT</Text>
        <Pressable
          accessibilityLabel="Open profile"
          onPress={() => router.push('/profile')}
          style={styles.profileButton}
        >
          {profilePicture ? (
            <Image
              accessibilityLabel="Open profile"
              source={{ uri: profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person-outline" size={21} color="#111111" />
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>HOME</Text>
        <Text style={styles.title}>HELLO, {userName.toUpperCase()}</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitle}>Welcome back to your student space.</Text>

        <Text style={styles.sectionTitle}>WHAT WOULD YOU LIKE TO DO?</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Report a lost item"
          onPress={() => router.push('/report-item?type=lost')}
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, styles.lostIcon]}>
            <Ionicons name="search-outline" size={25} color="#b42318" />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Report Lost Item</Text>
            <Text style={styles.actionDescription}>Tell the campus community what you lost.</Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color="#777777" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Report a found item"
          onPress={() => router.push('/report-item?type=found')}
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, styles.foundIcon]}>
            <Ionicons name="hand-left-outline" size={25} color="#237a57" />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Report Found Item</Text>
            <Text style={styles.actionDescription}>Help return something to its owner.</Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color="#777777" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Browse all items"
          onPress={() => router.push('/items')}
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, styles.browseIcon]}>
            <Ionicons name="list-outline" size={25} color="#0a7ea4" />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Browse All Items</Text>
            <Text style={styles.actionDescription}>Search the latest campus reports.</Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color="#777777" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    height: 76,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  brand: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  profileButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 21,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 21 },
  content: {
    padding: 28,
    paddingTop: 58,
    paddingBottom: 36,
  },
  eyebrow: {
    marginBottom: 12,
    color: '#0a7ea4',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: '#111111',
    fontSize: 32,
    fontWeight: '700',
  },
  rule: {
    width: 48,
    height: 3,
    marginTop: 22,
    marginBottom: 18,
    backgroundColor: '#0a7ea4',
  },
  subtitle: {
    color: '#666666',
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: 46,
    marginBottom: 14,
    color: '#0a7ea4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  actionCard: {
    minHeight: 92,
    marginBottom: 14,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  actionIcon: {
    width: 52,
    height: 52,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  lostIcon: { backgroundColor: '#fff1f0' },
  foundIcon: { backgroundColor: '#edf8f2' },
  browseIcon: { backgroundColor: '#e8f5f8' },
  actionCopy: { flex: 1 },
  actionTitle: { color: '#111111', fontSize: 16, fontWeight: '700' },
  actionDescription: { marginTop: 5, color: '#777777', fontSize: 13, lineHeight: 18 },
});