import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  doc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import FeedView from '../Views/FeedView';

const Feed = ({ route }) => {
  // Get userId from route params
  const { userId } = route.params;

  // State for user data and user's tweets
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // Real-time subscription for user data
    const unsubscribeUser = onSnapshot(doc(db, 'users', userId), async userDoc => {
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // References to followers and following collections
        const followersRef = collection(db, 'followers', userId, 'followers');
        const followingRef = collection(db, 'followers', userId, 'following');

        // Real-time listener for followers count
        const unsubscribeFollowers = onSnapshot(followersRef, snapshot => {
          setUser(prev => ({
            ...userData,
            uid: userId,
            followers: snapshot.size,
            following: prev?.following || 0,
          }));
        });

        // Real-time listener for following count
        const unsubscribeFollowing = onSnapshot(followingRef, snapshot => {
          setUser(prev => ({
            ...userData,
            uid: userId,
            followers: prev?.followers || 0,
            following: snapshot.size,
          }));
        });

        // Cleanup listeners
        return () => {
          unsubscribeFollowers();
          unsubscribeFollowing();
        };
      }
    });

    const fetchTweets = async () => {
      try {
        const tweetRef = collection(db, 'tweets');
        const tweetQuery = query(
          tweetRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
        );
        const tweetSnap = await getDocs(tweetQuery);
        const tweetList = tweetSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTweets(tweetList);
      } catch (error) {
        console.log('Error fetching tweets:', error);
      }
    };

    fetchTweets();

    // Cleanup user subscription on unmount
    return () => unsubscribeUser();
  }, [userId]);

  // Render nothing if user data is not loaded
  if (!user) return null;

  return <FeedView user={user} tweets={tweets} />;
};

export default Feed;
