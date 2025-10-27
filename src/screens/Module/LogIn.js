import React, { useState } from "react";
import { View, ScrollView, Alert, Image } from "react-native";
import { Card, TextInput, Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "../../Styles/styles";

const Login= ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        navigation.navigate("Home", { user: userData });
      } else {
        Alert.alert("Error", "User data not found.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../../images/vibes.png")}
            style={{ width: 150, height: 150, marginBottom: 10 }}
          />
          <Text style={styles.title}>Welcome Back</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              mode="outlined"
            />

            <Button mode="contained" onPress={handleLogin} style={styles.button}>
              Log In
            </Button>

            <Button mode="text" onPress={() => navigation.navigate("Register")}>
              Create an account
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default Login;
