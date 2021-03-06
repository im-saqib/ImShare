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
    // paddingBottom: 150,
  },
  containerInfo: {
    margin: 10,
  },
  flatList: { display: "flex", flexDirection: "column", height: "100%" },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    margin: 3,
  },
});

function Profile(props) {
  // console.log(props);
  const uid = firebase.auth().currentUser.uid;
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  useEffect(() => {
    const { currentUser, posts, uid } = props;
    if (props.route.params.uid === uid) {
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
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };
  const onMessage = () => {
    addContactList();
    firebase
      .firestore()
      .collection("chats")
      .doc(uid)
      .collection("private")
      .doc(props.route.params.uid)
      .set({});
  };
  const addContactList = async () => {
    await firebase
      .firestore()
      .collection("contacts")
      .doc(uid)
      .collection("userContacts")
      .doc(props.route.params.uid)
      .set({});
  };
  const onSignOut = () => {
    firebase.auth().signOut();
  };

  if (user == null) {
    return <View />;
  }
  return (
    <View style={styles.root}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        {props.route.params.uid !== uid ? (
          <View>
            {following ? (
              <>
                <Button title='Following' onPress={() => onUnFollow()} />
              </>
            ) : (
              <>
                <Button title='Follow' onPress={() => onFollow()} />
              </>
            )}
            <Button title='Message' onPress={() => addContactList()} />
          </View>
        ) : (
          <Button title='SignOut' onPress={() => onSignOut()} />
        )}
      </View>
      <FlatList
        numColumns={2}
        horizontal={false}
        data={userPosts}
        style={styles.flatList}
        renderItem={({ item }) => (
          <View style={{ flex: 1 / 2 }}>
            <Image style={styles.image} source={{ uri: item.downloadURL }} />
            <Text>{item.caption}</Text>
          </View>
        )}
      />
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});
export default connect(mapStateToProps, null)(Profile);
