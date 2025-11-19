import React, { useState, useEffect } from "react";
import { Card, Text, Divider, IconButton } from "react-native-paper";
import { View, Image } from "react-native";
import Video from 'react-native-video';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from "../../config/firebase";
import { getAuth } from 'firebase/auth';
import styles from "../../Styles/styles";

const TweetCard = ({ tweet }) => {
  const currentUser = getAuth().currentUser;
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the current user has already liked it
    if (tweet.likes && currentUser) {
      setIsLiked(tweet.likes.includes(currentUser.uid));
    }
  }, [tweet.likes, currentUser]);

  const handleLike = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      const tweetRef = doc(db, 'tweets', tweet.id);

      if (isLiked) {
        // Remove like
        await updateDoc(tweetRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setIsLiked(false);
      } else {
        // Like
        await updateDoc(tweetRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Just now';

    const date = timestamp.toDate();
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleString('en-US', options);
  };

  return (
    <Card style={styles.tweetCard}>
      <Card.Content>

        <View style={{ marginBottom: 8 }}>
          <Text style={styles.tweetHeader}>{tweet.fullName}</Text>
          <Text style={styles.tweetMeta}>
            @{tweet.username} • {formatDateTime(tweet.createdAt)}
          </Text>
        </View>

        <Divider style={{ marginVertical: 8 }} />

        <Text style={styles.tweetContent}>{tweet.content}</Text>

        {/* Render Image */}
        {tweet.image && !tweet.video && (
          <Image
            source={{ uri: tweet.image }}
            style={{ width: "100%", height: 250, marginTop: 10, borderRadius: 10 }}
            resizeMode="cover"
          />
        )}

        {/* Render Video */}
        {tweet.video && (
          <Video
            source={{ uri: tweet.video }}
            style={{ 
              width: "100%", 
              height: 250, 
              marginTop: 10, 
              borderRadius: 10,
              backgroundColor: '#000'
            }}
            controls={true}
            resizeMode="contain"
            paused={true}
            repeat={false}
            onError={(error) => console.log('Video error:', error)}
          />
        )}

        {/* Like button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <IconButton
            icon={isLiked ? "heart" : "heart-outline"}
            iconColor={isLiked ? "#9C27B0" : "#666"}
            size={24}
            onPress={handleLike}
            disabled={loading}
          />
        </View>

      </Card.Content>
    </Card>
  );
};

export default TweetCard;