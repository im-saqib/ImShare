import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

import firebase from "firebase";

export default function Search(props) {
  const [users, setUsers] = useState([]);
  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View style={{ margin: 8 }}>
      <TextInput
        placeholder='Search here..'
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <Text>{item.name}</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("Profile", { uid: item.id })
                }
                style={{ marginRight: 10 }}
              >
                <Text>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("Chat", { uid: item.id })
                }
                style={{ display: "flex" }}
              >
                <Text>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
