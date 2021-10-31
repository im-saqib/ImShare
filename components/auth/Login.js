import React, { Component } from "react";
import { Button, TextInput, View } from "react-native";

import firebase from "firebase";
import styles from "../../style/styles";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onSignIn = this.onSignIn.bind(this);
  }
  onSignIn() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
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
          placeholder='Email Address'
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder='Choose Password'
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <Button title='Sign In' onPress={() => this.onSignIn()} />
      </View>
    );
  }
}
