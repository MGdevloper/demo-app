import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { removeUserData } from "../authentication.config.js";
export default function HomeScreen() {
  useFocusEffect(
    React.useCallback(() => {
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

  const logout = async () => {
    try {
      await removeUserData(); 
      
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      
      <Pressable onPress={logout} style={styles.logoutbtn}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutbtn: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#111111',
    fontSize: 32,
    fontWeight: '700',
  },
});