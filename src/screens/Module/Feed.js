import React, { useEffect, useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import TweetCard from "../Views/TweetCard";
import styles from "../../Styles/styles";

const Feed = ({ route }) => {
  const { user } = route.params;
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const tweetList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetList);
    } catch (error) {
      console.error("Error loading tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTweets();
    setRefreshing(false);
  };

  if (loading)
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={{ marginTop: 10, color: "#6C2DC7" }}>Loading feed...</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ alignItems: "center"}}>
        <Text style={styles.feedTitle}>Latest Tweets</Text>
      </View>

      {tweets.length === 0 ? (
        <Text style={styles.emptyText}>No tweets yet 😅 </Text>
      ) : (
        tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
      )}

      <Button
        icon="refresh"
        mode="contained-tonal"
        onPress={fetchTweets}
        style={styles.refreshButton}
        labelStyle={styles.refreshButtonLabel}
      >
        Refresh
      </Button>
    </ScrollView>
  );
};

export default Feed;
