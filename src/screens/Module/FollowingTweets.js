import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import TweetCard from "../Views/TweetCard";
import styles from "../../Styles/styles";

const FollowingTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuth().currentUser;

  const fetchFollowedTweets = async () => {
    setLoading(true);
    try {
      // Get the list of users I follow
      const followingRef = collection(db, "followers", user.uid, "following");
      const followingSnapshot = await getDocs(followingRef);
      const followingIds = followingSnapshot.docs.map((doc) => doc.id);

      if (followingIds.length > 0) {
        const q = query(
          collection(db, "tweets"),
          where("userId", "in", followingIds),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTweets(data);
      } else {
        setTweets([]);
      }
    } catch (error) {
      console.error("Error fetching followed tweets:", error);
      setTweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowedTweets();
  }, []);

  if (loading) {
    return <ActivityIndicator animating color="#9C27B0" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchFollowedTweets} />}
    >
      {tweets.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
          No tweets from people you follow yet
        </Text>
      ) : (
        tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
      )}
    </ScrollView>
  );
};

export default FollowingTweets;