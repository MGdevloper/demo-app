import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function OAuthRedirect() {

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />

      <Text style={styles.text}>
        Completing Google sign in...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    marginTop: 20,
    fontSize: 16,
  },
});