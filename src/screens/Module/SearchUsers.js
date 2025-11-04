import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, TextInput, Button, Text, ActivityIndicator, Avatar } from 'react-native-paper';
import { collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import styles from '../../Styles/styles';

const SearchUsers = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingStatus, setFollowingStatus] = useState({});
  const currentUser = auth.currentUser;

  // Search users by username
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a username to search');
      return;
    }

    setLoading(true);
    try {
      // Get all users and filter by username
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const users = [];
      const statusMap = {};
      
      const searchLower = searchQuery.toLowerCase().trim();

      for (const docSnapshot of querySnapshot.docs) {
        const userData = docSnapshot.data();
        const userId = docSnapshot.id;

        // Don't include current user in results
        if (userId === currentUser.uid) continue;

        // Filter by username (case insensitive, partial match)
        const usernameLower = userData.username?.toLowerCase() || '';
        if (!usernameLower.includes(searchLower)) continue;

        // Check if already following this user
        const followingRef = doc(db, 'followers', currentUser.uid, 'following', userId);
        const followingSnap = await getDoc(followingRef);
        
        users.push({
          id: userId,
          ...userData,
        });
        
        statusMap[userId] = followingSnap.exists();
      }

      setSearchResults(users);
      setFollowingStatus(statusMap);

      if (users.length === 0) {
        Alert.alert('No results', `No users found with username containing "${searchQuery}"`);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Could not search users. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Follow or unfollow a user
  const handleFollowToggle = async (user) => {
    const isCurrentlyFollowing = followingStatus[user.id];

    try {
      const followingRef = doc(db, 'followers', currentUser.uid, 'following', user.id);
      const followerRef = doc(db, 'followers', user.id, 'followers', currentUser.uid);

      if (isCurrentlyFollowing) {
        // Unfollow
        await deleteDoc(followingRef);
        await deleteDoc(followerRef);
        
        setFollowingStatus(prev => ({
          ...prev,
          [user.id]: false,
        }));
        
        Alert.alert('Unfollowed', `You no longer follow @${user.username}`);
      } else {
        // Follow
        await setDoc(followingRef, { followedAt: new Date() });
        await setDoc(followerRef, { followedAt: new Date() });
        
        setFollowingStatus(prev => ({
          ...prev,
          [user.id]: true,
        }));
        
        Alert.alert('Success', `Now following @${user.username}`);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Could not update follow status');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Search Users</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Username"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              mode="outlined"
              placeholder="Enter username..."
              left={<TextInput.Icon icon="account-search" />}
            />

            <Button
              mode="contained"
              onPress={handleSearch}
              loading={loading}
              style={styles.button}
              disabled={loading}
            >
              Search
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 10 }}
            >
              Back
            </Button>
          </Card.Content>
        </Card>

        {/* Search Results */}
        {loading && (
          <ActivityIndicator 
            animating 
            color="#9C27B0" 
            style={{ marginTop: 20 }} 
            size="large"
          />
        )}

        {!loading && searchResults.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            
            {searchResults.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <Avatar.Image
                  size={50}
                  source={
                    user.photo 
                      ? { uri: user.photo } 
                      : require('../../../images/icono.jpg')
                  }
                  onTouchEnd={() => navigation.navigate('Feed', { userId: user.id })}
                />

                <View style={styles.userInfo}>
                  <Text 
                    style={styles.userFullName}
                    onPress={() => navigation.navigate('Feed', { userId: user.id })}
                  >
                    {user.fullName}
                  </Text>
                  <Text 
                    style={styles.userUsername}
                    onPress={() => navigation.navigate('Feed', { userId: user.id })}
                  >
                    @{user.username}
                  </Text>
                </View>

                <Button
                  mode={followingStatus[user.id] ? 'outlined' : 'contained'}
                  buttonColor={followingStatus[user.id] ? 'transparent' : '#9C27B0'}
                  textColor={followingStatus[user.id] ? '#9C27B0' : '#fff'}
                  onPress={() => handleFollowToggle(user)}
                  style={styles.followButton}
                  labelStyle={styles.followButtonLabel}
                >
                  {followingStatus[user.id] ? 'Following' : 'Follow'}
                </Button>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchUsers;