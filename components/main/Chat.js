import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
} from "react-native";

import firebase from "firebase/app";
import "firebase/firestore";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [sentMessage, setSentMessage] = useState("");
  useEffect(() => {
    const listener = firebase
      .firestore()
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((querySnapshot) => {
        let chatMessage = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const id = doc.id;
          return { id, ...firebaseData };
        });
        setMessages(chatMessage);
      });
    return () => listener();
  }, []);
  const sendMessage = async (e) => {
    e.preventDefault();
    await firebase
      .firestore()
      .collection("messages")
      .add({
        text: sentMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: firebase.auth().currentUser.uid,
      })
      .then(setSentMessage(""));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.msgBox}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={messages}
          renderItem={({ item }) => <Chat data={item} />}
        />
        {/* <Image source={} /> */}
        <TextInput
          placeholder='Type here...'
          onChangeText={(text) => setSentMessage(text)}
        />
      </View>
      <Button title='Send' onPress={sendMessage} />
    </View>
  );
}
function Chat(props) {
  const { text, id, uid } = props.data;
  const source = uid === firebase.auth().currentUser.uid ? "sent" : "recieve";

  return (
    <View style={[source == "sent" ? styles.sent : styles.recieve]}>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "black",
  },
  msgBox: {
    flex: 1,
  },
  sent: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "red",
    color: "white",
    padding: 5,
    margin: 5,
    alignSelf: "flex-end",
    flex: 6,
  },
  recieve: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "black",
    color: "white",
    padding: 5,
    margin: 5,
    alignSelf: "flex-start",
    flex: 6,
  },
});
