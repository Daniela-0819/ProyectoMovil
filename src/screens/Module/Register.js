import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, Image } from "react-native";
import { Card, TextInput, Button, Text } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import styles from "../../Styles/styles";

const Register= ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(fullName && username && email && password);
  }, [fullName, username, email, password]);

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        email,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.error("Error registering:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../../images/vibes.png")}
            style={{ width: 100, height: 100, marginBottom: 10 }}
          />
          <Text style={styles.title}>Create Account</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Full Name *"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Username *"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Password *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              disabled={!formValid}
            >
              Register
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 10 }}
            >
              Already have an account? Log in
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default Register;
