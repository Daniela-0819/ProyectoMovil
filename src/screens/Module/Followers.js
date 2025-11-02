import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Avatar, Button, ActivityIndicator } from 'react-native-paper';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import styles from '../../Styles/styles';

const Followers = ({ route }) => {
  const { user } = route.params;
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const allUsers = usersSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.id !== user.uid);
        setUsers(allUsers);

        const followingSnap = await getDocs(collection(db, 'followers', user.uid, 'following'));
        const followingList = followingSnap.docs.map(doc => doc.id);
        setFollowing(followingList);
      } catch (error) {
        console.log('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [user.uid]);

  const handleFollowToggle = async targetUserId => {
    try {
      const followingRef = doc(db, 'followers', user.uid, 'following', targetUserId);
      const followerRef = doc(db, 'followers', targetUserId, 'followers', user.uid);

      // Check if user is already following
      const isFollowing = following.includes(targetUserId);

      if (isFollowing) {
        await deleteDoc(followingRef);
        await deleteDoc(followerRef);
        setFollowing(prev => prev.filter(id => id !== targetUserId));
      } else {
        await setDoc(followingRef, { followedAt: new Date() });
        await setDoc(followerRef, { followedAt: new Date() });
        setFollowing(prev => [...prev, targetUserId]);
      }
    } catch (error) {
      console.log('Error following/unfollowing:', error);
    }
  };

  // Show loading indicator while data is fetching
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {users.map(u => (
        <View key={u.id} style={styles.userRow}>
          <Avatar.Image
            size={55}
            source={u.photo ? { uri: u.photo } : require('../../../images/icono.jpg')}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.profileName}>{u.fullName}</Text>
            <Text style={styles.profileUsername}>@{u.username}</Text>
          </View>
          <Button
            mode={following.includes(u.id) ? 'outlined' : 'contained'}
            onPress={() => handleFollowToggle(u.id)}
          >
            {following.includes(u.id) ? 'Following' : 'Follow'}
          </Button>
        </View>
      ))}
    </ScrollView>
  );
};

export default Followers;
