import React from "react";
import { Card, Text, Divider } from "react-native-paper";
import { View } from "react-native";
import styles from "../../Styles/styles";

const TweetCard = ({ tweet }) => {
  return (
    <Card style={styles.tweetCard}>
    <Card.Content>
    <View>
    <Text style={styles.tweetHeader}>
      {tweet.fullName}
    </Text>

    <Text style={styles.tweetHeader02}>
      @{tweet.username}
    </Text>


    <Text style={styles.tweetContent}>{tweet.content}</Text>

    <Text style={styles.tweetDate}>
      {tweet.createdAt?.toDate
        ? tweet.createdAt.toDate().toLocaleString()
        : "Just now"}
    </Text>
    </View>
  </Card.Content>
</Card>  
  );
};

export default TweetCard; 
