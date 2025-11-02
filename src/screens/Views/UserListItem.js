import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';
import { auth, db } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection } from 'firebase/firestore';
import styles from '../../Styles/styles';

const UserListItem = ({ user }) => {
  const currentUser = auth.currentUser;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const docRef = doc(db, 'followers', currentUser.uid, 'following', user.id);
        const docSnap = await getDoc(docRef);
        setIsFollowing(docSnap.exists());
      } catch (error) {
        console.log('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, []);

  const handleFollowToggle = async () => {
    try {
      const followingRef = doc(db, 'followers', currentUser.uid, 'following', user.id);
      const followerRef = doc(db, 'followers', user.id, 'followers', currentUser.uid);

      if (isFollowing) {
        // Unfollow
        await deleteDoc(followingRef);
        await deleteDoc(followerRef);
        setIsFollowing(false);
      } else {
        // Follow
        await setDoc(followingRef, { followedAt: new Date() });
        await setDoc(followerRef, { followedAt: new Date() });
        setIsFollowing(true);
      }
    } catch (error) {
      console.log('Error following/unfollowing:', error);
    }
  };

  return (
    <View style={styles.userCard}>
      <Avatar.Text
        size={50}
        label={user?.username?.[0]?.toUpperCase() || '?'}
        style={{ backgroundColor: '#9C27B0' }}
      />

      <View style={styles.userInfo}>
        <Text style={styles.userFullName}>{user.fullName}</Text>
        <Text style={styles.userUsername}>@{user.username}</Text>
      </View>

      {currentUser.uid !== user.id && (
        <Button
          mode={isFollowing ? 'outlined' : 'contained'}
          onPress={handleFollowToggle}
          style={styles.followButton}
          labelStyle={styles.followButtonLabel}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </View>
  );
};

export default UserListItem;
