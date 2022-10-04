import React, { useState, useEffect, useRef } from "react"
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native"
import Constants from "expo-constants"
import { Camera, CameraType } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import { MaterialIcons } from "@expo/vector-icons"
import Button from "./components/Button"

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      //ask user for permission
      MediaLibrary.requestPermissionsAsync()
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === "granted")
    })() //Immediately invoked function expression
  }, [])

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        console.log(data)
        setImage(data.uri)
      } catch (e) {
        console.log(e)
      }
    }
  }

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image)
        alert("Picture saved! 🎉")
        setImage(null)
        console.log("saved successfully! 🎉")
      } catch (error) {
        console.log(error)
      }
    }
  }

  if (hasCameraPermission === false) {
    return <Text>No Access to Camera</Text>
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
          >
            <Button
              icon={"retweet"}
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                )
              }}
            />
            <Button
              icon={"flash"}
              color={
                flash === Camera.Constants.FlashMode.off ? "gray" : "#f1f1f1"
              }
              onPress={() => {
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      <View style={styles.controls}>
        {image ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 50,
            }}
          >
            <Button
              title={"Retake"}
              icon="retweet"
              onPress={() => setImage(null)}
            />
            <Button title={"Save"} icon="check" onPress={savePicture} />
          </View>
        ) : (
          <Button
            title={"take a picture"}
            icon="camera"
            onPress={takePicture}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
    padding: 8,
  },
  controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#E9730F",
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
})
