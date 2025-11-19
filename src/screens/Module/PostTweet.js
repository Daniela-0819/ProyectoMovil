import React, { useState } from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { Card, TextInput, Button, Text, HelperText } from 'react-native-paper';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import styles from '../../Styles/styles';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadImageToCloudinary } from '../../config/cloudinaryUpload';

const PostTweet = ({ navigation, route }) => {
  const { user } = route.params;
  const [tweetContent, setTweetContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const MAX_CHARACTERS = 280;
  const remainingCharacters = MAX_CHARACTERS - tweetContent.length;
  const isOverLimit = remainingCharacters < 0;

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      async (response) => {
        if (response.didCancel) return;

        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          const uploadedUrl = await uploadImageToCloudinary(uri);
          setImageUrl(uploadedUrl);
        }
      }
    );
  };

  const handlePostTweet = async () => {
    if (!tweetContent.trim()) {
      Alert.alert('Error', 'You must write something before posting.');
      return;
    }

    if (isOverLimit) {
      Alert.alert('Error', `Your tweet exceeds the limit by ${Math.abs(remainingCharacters)} characters.`);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'tweets'), {
        userId: user.uid,
        username: user.username,
        fullName: user.fullName,
        content: tweetContent,
        image: imageUrl || null,
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        'Success',
        'Your tweet was posted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setTweetContent('');
              setImageUrl(null);
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error posting tweet:', error);
      Alert.alert('Error', 'Could not post tweet. Please try again.');
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
              error={isOverLimit}
            />

            <HelperText 
              type={isOverLimit ? 'error' : 'info'}
              visible={true}
              style={{ textAlign: 'right' }}
            >
              {remainingCharacters} characters remaining
            </HelperText>

            <Button 
              mode="outlined" 
              onPress={pickImage}
              style={{ marginBottom: 10 }}
            >
              Add Image
            </Button>

            {imageUrl && (
              <Image 
                source={{ uri: imageUrl }} 
                style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 10 }} 
              />
            )}

            <Button
              mode="contained"
              onPress={handlePostTweet}
              loading={loading}
              disabled={loading || isOverLimit || !tweetContent.trim()}
              style={styles.button}
            >
              Post Tweet
            </Button>

            <Button 
              mode="text" 
              onPress={() => navigation.goBack()} 
              style={{ marginTop: 10 }}
            >
              Cancel
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default PostTweet;
