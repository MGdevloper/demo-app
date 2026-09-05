import AsyncStorage from '@react-native-async-storage/async-storage';

async function getUser(accessToken) {

  try {
    console.log('Access Token:', accessToken);

    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const user = await response.json();

    console.log('User Information:', user);

    return user;
  } catch (error) {
    console.log('Error fetching user info:', error);
    return null;
  }
}

async function saveUserData(user) {

    await AsyncStorage.setItem('user', JSON.stringify(user));


    
}


async function removeUserData() {
    await AsyncStorage.removeItem('user');

}

async function isUserLoggedIn() {
    const userData = await AsyncStorage.getItem('user');


    return userData;
}






export { getUser,saveUserData,removeUserData,isUserLoggedIn };