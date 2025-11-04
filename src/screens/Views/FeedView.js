import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, Alert } from 'react-native';
import {
  Text,
  Avatar,
  Divider,
  Button,
  ActivityIndicator,
  IconButton,
  FAB,
} from 'react-native-paper';
import styles from '../../Styles/styles';
import TweetCard from './TweetCard';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

const FeedView = ({ user, tweets }) => {
  const navigation = useNavigation();
  const [userTweets, setUserTweets] = useState(tweets);
  const [refreshing, setRefreshing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState(null);
  const currentUser = auth.currentUser;

  //Load complete user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.warn('No user data found in Firestore');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Load user tweets
  const fetchTweets = async () => {
    setRefreshing(true);
    try {
      const snapshot = await getDocs(collection(db, 'tweets'));
      const tweetsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(t => t.userId === user.uid)
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setUserTweets(tweetsData);
    } catch (error) {
      console.log('Error fetching tweets:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Check if current user already follows this user
  const checkIfFollowing = async () => {
    if (!currentUser || currentUser.uid === user.uid) return;
    try {
      const docRef = doc(db, 'followers', currentUser.uid, 'following', user.uid);
      const docSnap = await getDoc(docRef);
      setIsFollowing(docSnap.exists());
    } catch (error) {
      console.log('Error checking following:', error);
    }
  };

  // Follow or unfollow the user
  const handleFollowToggle = async () => {
    if (!currentUser || currentUser.uid === user.uid) return;

    const targetFollowersRef = doc(db, 'followers', user.uid, 'followers', currentUser.uid);
    const currentFollowingRef = doc(db, 'followers', currentUser.uid, 'following', user.uid);

    try {
      if (isFollowing) {
        // --- Unfollow ---
        await deleteDoc(targetFollowersRef);
        await deleteDoc(currentFollowingRef);
        setIsFollowing(false);
        Alert.alert('Unfollowed', `You no longer follow @${user.username}`);
      } else {
        // --- Follow ---
        await setDoc(targetFollowersRef, { followedAt: new Date() });
        await setDoc(currentFollowingRef, { followedAt: new Date() });
        setIsFollowing(true);
        Alert.alert('Followed', `Now following @${user.username}`);
      }
    } catch (error) {
      console.error('Error updating follow:', error);
      Alert.alert('Error', 'Could not update follow status');
    }
  };

  useEffect(() => {
    fetchTweets();
    checkIfFollowing();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Profile header */}
        <View>
          <Avatar.Image
            size={80}
            source={user.photo ? { uri: user.photo } : require('../../../images/icono.jpg')}
          />
          <Text style={styles.profileName}>{user.fullName}</Text>
          <Text style={styles.profileUsername}>@{user.username}</Text>

          {/* Follow/Unfollow button */}
          {currentUser.uid !== user.uid && (
            <Button
              mode="contained"
              buttonColor={isFollowing ? '#C0C0C0' : '#9C27B0'}
              textColor={isFollowing ? '#000' : '#fff'}
              style={styles.followButtonProfile}
              onPress={handleFollowToggle}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </View>

        {/* Followers and Following counters */}
        <View style={styles.followColumn}>
          <Button
            mode="text"
            labelStyle={{ color: '#9C27B0', fontWeight: 'bold' }}
            onPress={() => navigation.navigate('Followers', { user })}
          >
            {user.followers} Followers
          </Button>

          <Button
            mode="text"
            labelStyle={{ color: '#9C27B0', fontWeight: 'bold' }}
            onPress={() => navigation.navigate('Following', { user })}
          >
            {user.following} Following
          </Button>
        </View>
      </View>

      <Divider style={{ marginVertical: 10 }} />

      {/* Tweets section */}
      <Text style={styles.sectionTitle}>Mis Tweets</Text>

      {refreshing && <ActivityIndicator color="#9C27B0" style={{ marginTop: 10 }} />}

      <FlatList
        data={userTweets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TweetCard tweet={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTweets} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>No tweets yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB new tweet*/}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          if (!userData) return;
          navigation.navigate('PostTweet', {
            user: {
              uid: auth.currentUser.uid,
              username: userData.username || 'Unknown',
              fullName: userData.fullName || 'No name',
            },
          });
        }}
      />

      {/* bottom navegation */}
      <View style={styles.bottomNav}>
        <IconButton
          icon="home"
          iconColor="#9C27B0"
          size={28}
          onPress={() => navigation.navigate('Home')}
        />

        <IconButton
          icon="magnify"
          iconColor="#9C27B0"
          size={28}
          onPress={() => navigation.navigate('SearchUsers')}
        />

        <IconButton
          icon="logout"
          iconColor="#9C27B0"
          size={28}
          onPress={async () => {
            try {
              await auth.signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'LogIn' }],
              });
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
        />
      </View>
    </View>
  );
};

export default FeedView;
