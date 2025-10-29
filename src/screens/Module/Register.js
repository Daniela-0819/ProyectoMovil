import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, Image } from 'react-native';
import { Card, TextInput, Button, Text } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import styles from '../../Styles/styles';

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(fullName && username && email && password);
  }, [fullName, username, email, password]);

  const handleRegister = async () => {
    try {
      //Check if the email or username already exists
      const emailQuery = query(collection(db, 'users'), where('email', '==', email));
      const usernameQuery = query(collection(db, 'users'), where('username', '==', username));

      const [emailSnapshot, usernameSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery),
      ]);

      if (!emailSnapshot.empty) {
        Alert.alert('Error', 'This email is already registered.');
        return;
      }
      if (!usernameSnapshot.empty) {
        Alert.alert('Error', 'This username is already taken.');
        return;
      }

      //Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //Save data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        username,
        email,
        createdAt: new Date(),
        followers: 0,
        following: 0,
      });

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('LogIn') },
      ]);
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../../../images/vibes.png')}
            style={{ width: 150, height: 150, marginBottom: 10 }}
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
              keyboardType="email-address" //Specifies a keyboard optimized for typing email addresses
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Password *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry //Used to hide the text input (passwords)
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
              onPress={() => navigation.navigate('Login')}
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
