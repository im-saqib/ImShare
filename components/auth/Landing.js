import React from "react";
import { View, Text, Button } from "react-native";

import styles from "../../style/styles";

export default function Landing({ navigation }) {
  return (
    <View style={styles.root}>
      <Text style={styles.sPadding}>Welcome</Text>
      <Button
        title='Register'
        onPress={() => navigation.navigate("Register")}
      />
      <Button title='Login' onPress={() => navigation.navigate("Login")} />
    </View>
  );
}
