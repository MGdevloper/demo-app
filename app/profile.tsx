import React from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSavedUser, removeUserData } from '../authentication.config.js';

export default function ProfileScreen() {
  const [user, setUser] = React.useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      getSavedUser().then(setUser);
    }, [])
  );

  const logout = async () => {
    await removeUserData();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </Pressable>
        <Text style={styles.topBarTitle}>PROFILE</Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          {user?.picture ? (
            <Image
              accessibilityLabel="Profile picture"
              source={{ uri: user.picture }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons name="person-outline" size={38} color="#0a7ea4" />
          )}
        </View>
        <Text style={styles.name}>{user?.name || 'Your profile'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>

        <View style={styles.details}>
          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{user?.name || '—'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user?.email || '—'}</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={logout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#b42318" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topBar: {
    height: 76,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  iconButton: { width: 42, height: 42, justifyContent: 'center' },
  topBarTitle: { color: '#111111', fontSize: 15, fontWeight: '800', letterSpacing: 1.4 },
  content: { alignItems: 'center', padding: 28 },
  avatar: {
    width: 88,
    height: 88,
    marginTop: 20,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: '#e8f5f8',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 44 },
  name: { color: '#111111', fontSize: 24, fontWeight: '700' },
  email: { marginTop: 6, color: '#666666', fontSize: 15 },
  details: { width: '100%', marginTop: 42 },
  sectionTitle: { marginBottom: 8, color: '#0a7ea4', fontSize: 12, fontWeight: '700', letterSpacing: 1.3 },
  detailRow: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  detailLabel: { color: '#777777', fontSize: 15 },
  detailValue: { maxWidth: '65%', color: '#111111', fontSize: 15, textAlign: 'right' },
  logoutButton: {
    margin: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: '#f0b9b4',
    borderRadius: 6,
  },
  logoutText: { color: '#b42318', fontSize: 16, fontWeight: '700' },
});