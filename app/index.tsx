import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Google from 'expo-auth-session/providers/google';
import { router, useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { getUser, saveUserData,isUserLoggedIn} from "../authentication.config.js"
import GoogleConfig from '../googleConfig';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  useEffect(() => {
    
    isUserLoggedIn().then((loggedIn) => {
      
      if (loggedIn!=null) {
        router.replace('/home');
        return
      }
      return;
      
    }); 
    
  }, []);

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
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showLoginError = (message: string) => {
    setErrorMessage(message);
    setLoading(false);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({

    androidClientId: GoogleConfig.androidClientId,

    scopes: ['openid', 'profile', 'email'],

    selectAccount: true,
  });

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await promptAsync();

      console.log('PROMPT RESULT:', result);

      if (result.type !== 'success') {
        setLoading(false);
      }
    } catch (error) {
      console.log('Google Login Error:', error);

      showLoginError('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (!response) return;

    console.log('GOOGLE RESPONSE:', response);


    if (response.type === 'success') {

      getUser(response.params.access_token).then(async (user) => {

        const email = user?.email?.trim().toLowerCase();
        if (!email || !email.endsWith('@charusat.edu.in')) {
          showLoginError('Please use your @charusat.edu.in Google account.');
          router.replace('/');
          return;
        }

        await saveUserData(user)
        console.log('Google Login Successful!');

        setLoading(false);
        router.replace('/home');

      }).catch((error) => {
        console.log('Error fetching user data:', error);

        showLoginError('Failed to fetch user data. Please try again.');
        return;
      })





    } else if (response.type === 'error') {
      console.log('Google Login Error:', response.error);

      showLoginError(response.error?.message || 'Google authentication failed.');
    } else if (
      response.type === 'cancel' ||
      response.type === 'dismiss'
    ) {
      console.log('Google Login ended:', response.type);
      setLoading(false);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <Text style={styles.subtitle}>
        Login using your CHARUSAT Google account
      </Text>

      <Pressable
        style={[
          styles.googleButton,
          (!request || loading) && styles.disabledButton,
        ]}
        onPress={handleGoogleLogin}
        disabled={!request || loading}
      >
        {loading ?

          (

            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>

              <Text style={styles.buttonText}>
                Continue with Google
              </Text>
            </>
          )}
      </Pressable>

      <Text style={styles.note}>
        Only @charusat.edu.in accounts are allowed.
      </Text>

      <Modal
        visible={errorMessage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorMessage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>!</Text>
            </View>
            <Text style={styles.errorTitle}>Login failed</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <Pressable
              style={styles.dismissButton}
              onPress={() => setErrorMessage(null)}
            >
              <Text style={styles.dismissButtonText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },

  googleButton: {
    width: '90%',
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },

  disabledButton: {
    opacity: 0.6,
  },

  googleIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 12,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  note: {
    marginTop: 20,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },

  errorCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    padding: 28,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  errorIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderRadius: 26,
    backgroundColor: '#fef2f2',
  },

  errorIconText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#dc2626',
  },

  errorTitle: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  errorMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#6b7280',
  },

  dismissButton: {
    width: '100%',
    marginTop: 24,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#111827',
  },

  dismissButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});