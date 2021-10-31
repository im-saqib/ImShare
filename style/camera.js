import { StyleSheet } from "react-native";

const cameraStyle = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "blue",
    borderWidth: 1,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1, //input in reverse order for 4:3 put 3 / 4
  },
  megaContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
    borderColor: "blue",
    borderWidth: 1,
  },
  button: {
    // flex: 0.1,
    borderWidth: 1,
    borderColor: "blue",
    margin: 5,
    padding: 5,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "blue",
  },
  image: {
    flex: 1,
  },
});
export default cameraStyle;
