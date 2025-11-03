import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import TweetCard from '../Views/TweetCard';
import styles from '../../Styles/styles';

const ForYou = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuth().currentUser;

  const fetchTweets = async () => {
    setLoading(true);
    try {
      // Get the IDs of users who FOLLOW ME (my followers)
      const followersRef = collection(db, 'followers', user.uid, 'followers');
      const followersSnapshot = await getDocs(followersRef);
      const followerIds = followersSnapshot.docs.map(doc => doc.id);

      if (followerIds.length > 0) {
        // Get tweets only from my followers
        const q = query(
          collection(db, 'tweets'),
          where('userId', 'in', followerIds),
          orderBy('createdAt', 'desc'),
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTweets(data);
      } else {
        // If I have no followers, show no tweets
        setTweets([]);
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setTweets([]);
    } finally {
      setLoading(false);
    }
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
      {tweets.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
          No tweets from your followers yet
        </Text>
      ) : (
        tweets.map(tweet => <TweetCard key={tweet.id} tweet={tweet} />)
      )}
    </ScrollView>
  );
};

export default ForYou;
