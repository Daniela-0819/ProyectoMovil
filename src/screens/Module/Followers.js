import React, { useEffect, useState } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebase';
import UserListItemView from '../Views/UserListItem';
import styles from '../../Styles/styles';

const Followers = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowers = async () => {
    try {
      setLoading(true);

      // Get the IDs of the current user's followers
      const followersRef = collection(db, 'followers', user.uid, 'followers');
      const snapshot = await getDocs(followersRef);

      const followerIds = snapshot.docs.map(doc => doc.id);

      // Obtain information for each follower from the users collection
      const followersData = [];
      for (const id of followerIds) {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          followersData.push({ id, ...userDoc.data() });
        }
      }

      setFollowers(followersData);
    } catch (error) {
      console.error('Error loading followers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowers();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={[styles.title, { marginTop: 10 }]}>Loading followers...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.followersContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.followersTitle}>Followers</Text>

      <View style={styles.countersContainer}>
        <View style={styles.counterBox}>
          <Text style={styles.counterNumber}>{followers.length}</Text>
          <Text style={styles.counterLabel}>Followers</Text>
        </View>
      </View>

      {followers.length === 0 ? (
        <Text style={styles.emptyText}>No followers yet</Text>
      ) : (
        followers.map(follower => (
          <UserListItemView 
            key={follower.id} 
            user={follower} 
            showFollowButton={true}
            onPress={() => navigation.navigate('Feed', { userId: follower.id })}
          />
        ))
      )}
    </ScrollView>
  );
};

export default Followers;