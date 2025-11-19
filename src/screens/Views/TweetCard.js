import React from "react";
import { Card, Text, Divider } from "react-native-paper";
import { View, Image } from "react-native";
import styles from "../../Styles/styles";

const TweetCard = ({ tweet }) => {

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

        {tweet.image && (
          <Image
            source={{ uri: tweet.image }}
            style={{ width: "100%", height: 250, marginTop: 10, borderRadius: 10 }}
            resizeMode="cover"
          />
        )}

      </Card.Content>
    </Card>
  );
};

export default TweetCard;