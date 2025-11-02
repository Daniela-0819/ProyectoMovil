import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import TweetCard from "../Views/TweetCard";
import styles from "../../Styles/styles";

const ForYou = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTweets = async () => {
    setLoading(true);
    const q = query(collection(db, "tweets"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTweets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  if (loading) {
    return <ActivityIndicator animating color="#9C27B0" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTweets} />}
    >
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </ScrollView>
  );
};

export default ForYou;
