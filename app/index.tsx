import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
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
  
  const [loading, setLoading] = useState(false);

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

      Alert.alert(
        'Login Failed',
        'Something went wrong. Please try again.'
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    if (!response) return;

    console.log('GOOGLE RESPONSE:', response);


    if (response.type === 'success') {

      getUser(response.params.access_token).then(async (user) => {

        await saveUserData(user)
        console.log('Google Login Successful!');

        setLoading(false);
        router.replace('/home');

      }).catch((error) => {
        console.log('Error fetching user data:', error);

        Alert.alert(
          'Login Failed',
          'Failed to fetch user data. Please try again.'
        );

        setLoading(false);
        return;
      })





    } else if (response.type === 'error') {
      console.log('Google Login Error:', response.error);

      Alert.alert(
        'Login Failed',
        response.error?.message ||
        'Google authentication failed.'
      );

      setLoading(false);
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
});