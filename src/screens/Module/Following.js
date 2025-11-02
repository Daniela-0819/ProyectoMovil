import React, { useEffect, useState } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import UserListItemView from '../Views/UserListItem';
import styles from '../../Styles/styles';

const Following = ({ route }) => {
  const { user } = route.params;
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowing = async () => {
    try {
      setLoading(true);

      // Find the IDs of the users this user follows
      const followingRef = collection(db, 'followers', user.uid, 'following');
      const snapshot = await getDocs(followingRef);

      const followingIds = snapshot.docs.map(doc => doc.id);

      // Obtain information for each user followed from the user collection
      const followingData = [];
      for (const id of followingIds) {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          followingData.push({ id, ...userDoc.data() });
        }
      }

      setFollowing(followingData);
    } catch (error) {
      console.error('Error al cargar siguiendo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowing();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={[styles.title, { marginTop: 10 }]}>Loading following...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.followersContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.followersTitle}>Following</Text>

      <View style={styles.countersContainer}>
        <View style={styles.counterBox}>
          <Text style={styles.counterNumber}>{following.length}</Text>
          <Text style={styles.counterLabel}>Following</Text>
        </View>
      </View>

      {following.length === 0 ? (
        <Text style={styles.emptyText}>You are not following anyone yet</Text>
      ) : (
        following.map(user => (
          <UserListItemView key={user.id} user={user} showFollowButton={false} />
        ))
      )}
    </ScrollView>
  );
};

export default Following;
