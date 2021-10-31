import React, { Component } from "react";
import { Button, Text, TextInput, View } from "react-native";

import firebase from "firebase";

import styles from "../../style/styles";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }
  onSignUp() {
    const { name, email, password } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
          });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    // console.log(this.props);
    return (
      <View style={styles.root}>
        <TextInput
          placeholder='First and Last Name'
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          placeholder='Email Address'
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder='Choose Password'
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <Button title='Sign Up' onPress={() => this.onSignUp()} />
      </View>
    );
  }
}
