import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";

const styles = StyleSheet.create({
  root: {
    paddingTop: StatusBar.currentHeight,
  },
  containerInfo: {
    margin: 10,
  },
  containerGallery: {
    margin: 10,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { currentUser, posts, uid } = props;
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("User does not exist or no data found");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }
  }, [props.route.params.uid]);
  if (user == null) {
    return <View />;
  }
  return (
    <View style={styles.root}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              <Text>{item.caption}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});
export default connect(mapStateToProps, null)(Profile); //null because we are not exporting any actions
