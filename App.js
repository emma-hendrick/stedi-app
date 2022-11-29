import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, Alert } from 'react-native';
import  Navigation from './components/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const AppStack = createNativeStackNavigator();

const App = () =>{
  const [isFirstLaunch, setFirstLaunch] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [textSent, setTextSent] = React.useState(false);
  const [homeTodayScore, setHomeTodayScore] = React.useState(0);

  useEffect(() => {
    const getSessionToken = async() => {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      console.log('token from storage', sessionToken);

      const validateResponse = await fetch('https://dev.stedi.me/validate/' + sessionToken);

      if (validateResponse.status == 200) { // The token is valid
        const userEmail = await validateResponse.text();
        await AsyncStorage.setItem('userName', userEmail);
        console.log('userEmail', userEmail);
        setIsLoggedIn(true);
        setFirstLaunch(false);
      }
      else {
        setIsLoggedIn(false);
        setTextSent(false);
        Alert.alert('Communication Error', 'Server responded to send text with status: ' + validateResponse.status);
      }
    }

    getSessionToken();
  })

   if (isFirstLaunch == true){
return(
  <OnboardingScreen setFirstLaunch={setFirstLaunch}/>
 
);
  }else if (isLoggedIn) {
    return <Navigation setHomeTodayScore={setHomeTodayScore}/>
  }else if (textSent) {
    return (
      <View>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          keyboardType="phone-pad"
          placeholderTextColor="#4251f5"
          placeholder="One Time Password">
        </TextInput>
        <Button
          title="Login"
          style={styles.button}
          onPress={async () => {
            const loginResponse = await fetch(
              'https://dev.stedi.me/twofactorlogin',
              {
              method: 'POST',
              headers: {
                'content-type' : 'application/json'
              },
              body: JSON.stringify({
                "phoneNumber": phoneNumber,
                "oneTimePassword": otp
              })
              }
            );
            
            if (loginResponse.status == 200) {
              const sessionToken = await loginResponse.text();
              console.log('Session Token', sessionToken);
              await AsyncStorage.setItem('sessionToken', sessionToken);
              setIsLoggedIn(true);
            } else {
              console.log("Token response status", loginResponse.status);
              Alert.alert("Warning, Error Created With HTTP Code", loginResponse.status);
              setIsLoggedIn(false);
              setTextSent(false);
            }
          
          }}
        />
      </View>
    )
  }
  else{
    return (
      <View>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType="phone-pad"
          placeholderTextColor="#4251f5"
          placeholder="Cell Phone">
        </TextInput>
        <Button
          title="Send"
          style={styles.button}
          onPress={async () => {
            const sendTextResponse = await fetch(
              'https://dev.stedi.me/twofactorlogin/' + phoneNumber,
              {
              method: 'POST',
              headers: {
                'content-type' : 'application/text'
              }
              }
            );

            if (sendTextResponse.status != 200) {
              Alert.alert('Communication Error', 'Server responded to send text with status: ' + sendTextResponse.status);
            }
            else {
              setTextSent(true)
            }
            
          }}
        />
      </View>
    )
    //return <Navigation/>
  }
}

 export default App;

 const styles = StyleSheet.create({
  container:{
      flex:1, 
      alignItems:'center',
      justifyContent: 'center'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 100
  },
  margin:{
    marginTop:100
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }    
})