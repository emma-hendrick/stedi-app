import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, TextInput, Button } from 'react-native';
import  Navigation from './components/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';




const AppStack = createNativeStackNavigator();

const App = () =>{
  const [isFirstLaunch, setFirstLaunch] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [textSent, setTextSent] = React.useState(false);
  const [homeTodayScore, setHomeTodayScore] = React.useState(0);

   if (isFirstLaunch == true){
return(
  <OnboardingScreen setFirstLaunch={setFirstLaunch}/>
 
);
  }else if (isLoggedIn) {
    return <Navigation/>
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
          title="Send"
          style={styles.button}
          onPress={async () => {
            await fetch(
              'https://dev.stedi.me/twofactorlogin/',
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
            ).then((res) => {
              if (res.status != 401) {
                setIsLoggedIn(true);
              }
            })
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
            await fetch(
              'https://dev.stedi.me/twofactorlogin/' + phoneNumber,
              {
              method: 'POST',
              headers: {
                'content-type' : 'application/text'
              }
              }
            ).then(setTextSent(true))
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