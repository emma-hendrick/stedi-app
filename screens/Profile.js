import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView , Share, ScrollView, Button} from 'react-native';
import { Card, CardTitle, CardContent} from 'react-native-material-cards';
import BarChart from 'react-native-bar-chart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

const cameraOptions = {
  quality: 0,
  exif: false
}

// import Share from 'react-native-share';

// const data = [
//   [70, 0],
//   [80,0],
//   [110, 0],
//   [100, 0],
//   [280, 0],
//   [80,0 ],
//   [110, 0]

// ];
// labels
// const horizontalData = ['S', 'M', 'T', 'W', 'T', 'F','S'];

const Profile = (props) => {

  const [userName, setUserName] = React.useState("");
  const [profilePhoto, setProfilePhoto] = React.useState("");
  const [cameraPermission, setCameraPermission] = React.useState("");
  const [cameraReady, setCameraReady] = React.useState("");
  const cameraRef = useRef(null);

  useEffect(() => {
    const getUserName = async() => {
      if(cameraPermission.status != "granted"){
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      console.log('camera permission', cameraPermission);
      setCameraPermission(cameraPermission);
      }
      setUserName(await AsyncStorage.getItem('userName'));
      setProfilePhoto(await AsyncStorage.getItem('profilePhoto'));
    }

    getUserName();
  })

  const myCustomerShare = async() =>{
    const shareOptions = {
      message: 'This is a test'
    }
    try{
      const shareResponse = await Share.share(shareOptions)
      console.log(shareResponse);
      }
      catch(error){
  console.log('Error', error)
      }
    }

  if (!cameraPermission) {
    return <View />;
  }

  if (profilePhoto == null) {
    return (
      <View style = {styles.container}>
        <Camera style = {styles.camera} type = {Camera.Constants.Type.front} ref = {cameraRef} onCameraReady = {() => {setCameraReady(true)}}>
          <View style = {styles.buttonContainer}>
            {cameraReady?<TouchableOpacity style = {styles.button} onPress = {async () => {

              const picture = await cameraRef.current.takePictureAsync(cameraOptions);
              console.log('Picture', picture);
              await AsyncStorage.setItem('profilePhoto', picture.uri);
              setProfilePhoto(picture.uri);

            }}>
              <Text style = {styles.text}>Take Picture</Text>
            </TouchableOpacity>:null}
          </View>
        </Camera>
      </View>
    );
  }
  else {
    return (
      <SafeAreaView style={{flex: 1}}>
          <Card style={{backgroundColor:'white', borderRadius: 10, margin:20 ,width: 320, shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4}}>
      <CardContent>
      <Image style={{height: 100, width:100, borderRadius: 75}}
        source={{uri:profilePhoto}} />
      <Text style={{marginTop:10,marginBottom:10,fontWeight: 'bold'}}>{userName}</Text>

      <Text style={{marginTop:20,marginBottom:2}}>This Week's progress</Text>
  {/* <BarChart barColor='green' data={data} horizontalData={horizontalData} /> */}
      <View style={{ marginTop: 50 }}>
        <Button onPress={myCustomerShare} title="Share" />
      </View>
      </CardContent>
      </Card>
  </SafeAreaView>
    );
  }
};
export default Profile;
const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:20
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  }
})
