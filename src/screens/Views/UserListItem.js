import React, { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';
import { auth, db } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import styles from '../../Styles/styles';

const UserListItem = ({ user, showFollowButton = true, onPress }) => {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser || currentUser.uid === user.id) return;

      try {
        const docRef = doc(db, 'followers', currentUser.uid, 'following', user.id);
        const docSnap = await getDoc(docRef);
        setIsFollowing(docSnap.exists());
      } catch (error) {
        console.log('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [user.id]);

  const handleFollowToggle = async () => {
    if (loading) return;

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToFeed = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Feed', { userId: user.id });
    }
  };

  return (
    <View style={styles.userCard}>

      {/* Avatar - clickeable */}
      <Pressable
        onPress={handleNavigateToFeed}
        style={({ pressed }) => [
          { opacity: pressed ? 0.6 : 1 }
        ]}
      >
        <Avatar.Image
          size={50}
          source={
            user.photo
              ? { uri: user.photo }
              : require('../../../images/icono.jpg')
          }
        />
      </Pressable>

      {/* User info - clickeable */}
      <Pressable
        onPress={handleNavigateToFeed}
        style={({ pressed }) => [
          styles.userInfo,
          { opacity: pressed ? 0.6 : 1 }
        ]}
      >
        <Text style={styles.userFullName}>{user.fullName}</Text>
        <Text style={styles.userUsername}>@{user.username}</Text>
      </Pressable>

      {/* Follow button */}
      {showFollowButton && currentUser.uid !== user.id && (
        <Button
          mode={isFollowing ? 'outlined' : 'contained'}
          buttonColor={isFollowing ? 'transparent' : '#9C27B0'}
          textColor={isFollowing ? '#9C27B0' : '#fff'}
          onPress={handleFollowToggle}
          loading={loading}
          disabled={loading}
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
