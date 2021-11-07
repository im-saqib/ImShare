import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Button,
  View,
  Text,
  Image,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";

const styles = StyleSheet.create({
  root: {
    // paddingTop: StatusBar.currentHeight,
    flex: 1,
    padding: 5,
  },
  containerImage: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    margin: 3,
  },
});

function Feed(props) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let postsFetched = [];
    if (
      (props.usersLoaded == props.following.length) !== 0 &&
      props.following.length
    ) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find((el) => el.uid === props.following[i]);
        if (user != undefined) {
          postsFetched = [...postsFetched, ...user.posts];
        }
      }
      posts.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(postsFetched);
    }
  }, [props.usersLoaded]);

  if (posts == null) {
    return (
      <View>
        <Text>Please wait</Text>
      </View>
    );
  }
  return (
    <View style={styles.root}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.containerImage}>
            <Image style={styles.image} source={{ uri: item.downloadURL }} />
            <Text>{item.caption}</Text>
            <Text>Uploaded by {item.user.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
});
export default connect(mapStateToProps, null)(Feed);
