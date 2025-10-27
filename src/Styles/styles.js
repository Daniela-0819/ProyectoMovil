import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf7ff",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6C2DC7",
    textAlign: "center",
  },
  card: {
    margin: 20,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 5,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#9C27B0",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#6C2DC7",
  },
});

export default styles;
