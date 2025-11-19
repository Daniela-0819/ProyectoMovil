import React, { useState, useRef } from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { Card, TextInput, Button, Text, HelperText, IconButton } from 'react-native-paper';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import styles from '../../Styles/styles';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '../../config/cloudinaryUpload';
import Video from 'react-native-video';

const PostTweet = ({ navigation, route }) => {
  const { user } = route.params;
  const [tweetContent, setTweetContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);

  const MAX_CHARACTERS = 280;
  const MAX_VIDEO_DURATION = 16; // seconds
  const remainingCharacters = MAX_CHARACTERS - tweetContent.length;
  const isOverLimit = remainingCharacters < 0;

    // Select image
  const pickImage = () => {
    launchImageLibrary(
      { 
        mediaType: 'photo', 
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.error) {
          Alert.alert('Error', 'Failed to pick image');
          return;
        }

        if (response.assets && response.assets.length > 0) {
          setUploading(true);
          try {
            const uri = response.assets[0].uri;
            const uploadedUrl = await uploadImageToCloudinary(uri);
            
            if (uploadedUrl) {
              setMediaUrl(uploadedUrl);
              setMediaType('image');
              Alert.alert('Success', 'Image uploaded successfully!');
            } else {
              Alert.alert('Error', 'Failed to upload image');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to upload image');
            console.error(error);
          } finally {
            setUploading(false);
          }
        }
      }
    );
  };

  // Select video
  const pickVideo = () => {
    launchImageLibrary(
      { 
        mediaType: 'video',
        videoQuality: 'medium',
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.error) {
          Alert.alert('Error', 'Failed to pick video');
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          const duration = asset.duration || 0;

        // Validate that the video does not exceed the limit
          if (duration > MAX_VIDEO_DURATION) {
            Alert.alert(
              'Video Too Long',
              `Your video is ${Math.round(duration)} seconds long. Please select a video of ${MAX_VIDEO_DURATION} seconds or less.`
            );
            return;
          }

          // If the video is within the limit, upload directly
          await uploadVideo(asset.uri, duration);
        }
      }
    );
  };

  // Separate function for uploading the video
  const uploadVideo = async (uri, duration) => {
    setUploading(true);
    try {
      const result = await uploadVideoToCloudinary(uri, duration);
      
      if (result && result.url) {
        setMediaUrl(result.url);
        setMediaType('video');
        setVideoDuration(result.duration);
        Alert.alert('Success', `Video uploaded successfully! Duration: ${Math.round(result.duration)}s`);
      } else {
        Alert.alert('Error', 'Failed to upload video');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Remove media
  const removeMedia = () => {
    setMediaUrl(null);
    setMediaType(null);
    setVideoDuration(0);
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
      const tweetData = {
        userId: user.uid,
        username: user.username,
        fullName: user.fullName,
        content: tweetContent,
        createdAt: serverTimestamp(),
      };

      // Add media according to type
      if (mediaUrl && mediaType) {
        if (mediaType === 'image') {
          tweetData.image = mediaUrl;
          tweetData.mediaType = 'image';
        } else if (mediaType === 'video') {
          tweetData.video = mediaUrl;
          tweetData.mediaType = 'video';
          tweetData.videoDuration = videoDuration;
        }
      }

      await addDoc(collection(db, 'tweets'), tweetData);

      Alert.alert(
        'Success',
        'Your tweet was posted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setTweetContent('');
              setMediaUrl(null);
              setMediaType(null);
              setVideoDuration(0);
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

            {/* Buttons to add media */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              <Button 
                mode="outlined" 
                onPress={pickImage}
                disabled={uploading || !!mediaUrl}
                icon="image"
                style={{ flex: 1 }}
              >
                Add Image
              </Button>

              <Button 
                mode="outlined" 
                onPress={pickVideo}
                disabled={uploading || !!mediaUrl}
                icon="video"
                style={{ flex: 1 }}
              >
                Add Video (16s max)
              </Button>
            </View>

            {/* Charge indicator */}
            {uploading && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text>Uploading {mediaType || 'media'}...</Text>
              </View>
            )}

            {/* Image preview */}
            {mediaUrl && mediaType === 'image' && (
              <View style={{ position: 'relative', marginBottom: 10 }}>
                <Image 
                  source={{ uri: mediaUrl }} 
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    borderRadius: 10 
                  }} 
                  resizeMode="cover"
                />
                <IconButton
                  icon="close-circle"
                  size={30}
                  iconColor="#fff"
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                  }}
                  onPress={removeMedia}
                />
              </View>
            )}

            {/* Video preview */}
            {mediaUrl && mediaType === 'video' && (
              <View style={{ position: 'relative', marginBottom: 10 }}>
                <Video
                  ref={videoRef}
                  source={{ uri: mediaUrl }}
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    borderRadius: 10,
                    backgroundColor: '#000'
                  }}
                  controls={true}
                  resizeMode="contain"
                  paused={true}
                />
                <View style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  padding: 5,
                  borderRadius: 5
                }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>
                    {Math.round(videoDuration)}s / {MAX_VIDEO_DURATION}s
                  </Text>
                </View>
                <IconButton
                  icon="close-circle"
                  size={30}
                  iconColor="#fff"
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                  }}
                  onPress={removeMedia}
                />
              </View>
            )}

            <Button
              mode="contained"
              onPress={handlePostTweet}
              loading={loading}
              disabled={loading || uploading || isOverLimit || !tweetContent.trim()}
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