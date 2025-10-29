import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, TextInput, Button, Text } from 'react-native-paper';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import styles from '../../Styles/styles';

const PostTweet = ({ navigation, route }) => {
  const { user } = route.params; // Viene del Home
  const [tweetContent, setTweetContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePostTweet = async () => {
    if (!tweetContent.trim()) {
      Alert.alert('Error', 'You must write something before posting.');
      return;
    }

    setLoading(true);
    try {
      // Create the document in Firestore
      await addDoc(collection(db, 'tweets'), {
        userId: user.uid,
        username: user.username,
        fullName: user.fullName,
        content: tweetContent,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Your tweet was posted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      setTweetContent('');
    } catch (error) {
      console.error('Error posting tweet:', error);
      Alert.alert('Error', 'Could not post tweet. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create a New Tweet</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="What's happening?"
              value={tweetContent}
              onChangeText={setTweetContent}
              multiline
              numberOfLines={5}
              mode="outlined"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handlePostTweet}
              loading={loading}
              style={styles.button}
            >
              Post Tweet
            </Button>

            <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
              Cancel
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default PostTweet;
