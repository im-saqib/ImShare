import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import cameraStyle from "../../style/camera";

export default function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        setHasGalleryPermission(galleryStatus.status === "granted");
      }
    })();
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      // console.log(result);
      setImage(result.uri);
    }
  };
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      // console.log(data.uri);
    }
  };
  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={cameraStyle.root}>
      <View style={cameraStyle.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={cameraStyle.fixedRatio}
          ratio={"1:1"}
          type={type}
        />
      </View>
      {/* <View style={cameraStyle.imageContainer}>
        <Image style={cameraStyle.image} source={{ uri: image }} />
      </View> */}
      <View style={cameraStyle.megaContainer}>
        {image && (
          <View style={cameraStyle.imageContainer}>
            {image ? (
              <Image style={cameraStyle.image} source={{ uri: image }} />
            ) : (
              <Text>Preview</Text>
            )}
          </View>
        )}
        <View>
          <Button
            // style={cameraStyle.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
            title='Flip'
          />
          {/* <Text style={cameraStyle.buttonText}>Flip</Text>
          </Button> */}
          <TouchableOpacity
            style={cameraStyle.button}
            onPress={() => takePicture()}
          >
            <Text style={cameraStyle.buttonText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cameraStyle.button} onPress={pickImage}>
            <Text style={cameraStyle.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={cameraStyle.button}
            onPress={() => navigation.navigate("Save", { image })}
          >
            <Text style={cameraStyle.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
