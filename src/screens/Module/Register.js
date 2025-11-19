import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, Image } from 'react-native';
import { Card, TextInput, Button, Text, HelperText } from 'react-native-paper';
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormValid(fullName && username && email && password && password.length >= 6);
  }, [fullName, username, email, password]);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validate inputs
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      //Check if the email or username already exists
      const emailQuery = query(
        collection(db, 'users'),
        where('email', '==', email.toLowerCase().trim()),
      );
      const usernameQuery = query(
        collection(db, 'users'),
        where('username', '==', username.toLowerCase().trim()),
      );

      const [emailSnapshot, usernameSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery),
      ]);

      if (!emailSnapshot.empty) {
        Alert.alert(
          'Registration Error',
          'This email is already registered. Please use a different email or try logging in.',
        );
        return;
      }

      if (!usernameSnapshot.empty) {
        Alert.alert(
          'Registration Error',
          'This username is already taken. Please choose a different username.',
        );
        return;
      }

      //Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //Save data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName.trim(),
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date(),
        followers: 0,
        following: 0,
      });

      Alert.alert('Registration Successful', 'Your account has been created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('LogIn') },
      ]);
    } catch (error) {
      console.error('Error registering:', error);

      let errorMessage = 'An error occurred during registration. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      }

      Alert.alert('Registration Error', errorMessage);
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
              onChangeText={text => {
                setFullName(text);
                setErrors({ ...errors, fullName: null });
              }}
              style={styles.input}
              mode="outlined"
              error={!!errors.fullName}
            />
            {errors.fullName && <HelperText type="error">{errors.fullName}</HelperText>}

            <TextInput
              label="Username *"
              value={username}
              onChangeText={text => {
                setUsername(text);
                setErrors({ ...errors, username: null });
              }}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              error={!!errors.username}
            />
            {errors.username && <HelperText type="error">{errors.username}</HelperText>}

            <TextInput
              label="Email *"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              mode="outlined"
              error={!!errors.email}
            />
            {errors.email && <HelperText type="error">{errors.email}</HelperText>}

            <TextInput
              label="Password *"
              value={password}
              onChangeText={text => {
                setPassword(text);
                setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              error={!!errors.password}
            />
            {errors.password && <HelperText type="error">{errors.password}</HelperText>}
            <HelperText type="info" visible={!errors.password}>
              Password must be at least 6 characters
            </HelperText>

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
              onPress={() => navigation.navigate('LogIn')}
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
