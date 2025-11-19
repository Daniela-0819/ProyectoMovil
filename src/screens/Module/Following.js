import React, { useEffect, useState } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebase';
import UserListItemView from '../Views/UserListItem';
import styles from '../../Styles/styles';

const Following = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [following, setFollowing] = useState([]);
  const [allFollowing, setAllFollowing] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const USERS_PER_PAGE = 10;

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      // Find the IDs of the users this user follows
      const followingRef = collection(db, 'followers', user.uid, 'following');
      const followingQuery = query(followingRef, orderBy('followedAt', 'desc'));
      const snapshot = await getDocs(followingQuery);

      setTotalCount(snapshot.size);
      console.log(`Total following: ${snapshot.size}`);

      if (snapshot.empty) {
        setAllFollowing([]);
        setFollowing([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const followingIds = snapshot.docs.map(doc => doc.id);
      // Obtain information for each user followed from the user collection
      const followingData = [];

      // Fetch user details for each followed user
      for (const id of followingIds) {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          followingData.push({ id, ...userDoc.data() });
        }
      }

      setAllFollowing(followingData);
      setTotalPages(Math.ceil(followingData.length / USERS_PER_PAGE) || 1);

      // Show first page
      const firstPage = followingData.slice(0, USERS_PER_PAGE);
      setFollowing(firstPage);
      setCurrentPage(1);

      console.log(
        `Loaded ${followingData.length} following, showing page 1 of ${Math.ceil(followingData.length / USERS_PER_PAGE)}`,
      );
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [user.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowing();
    setRefreshing(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      const pageData = allFollowing.slice(startIndex, endIndex);

      setFollowing(pageData);
      setCurrentPage(nextPage);
      console.log(`Showing following page ${nextPage} of ${totalPages}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const startIndex = (prevPage - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      const pageData = allFollowing.slice(startIndex, endIndex);

      setFollowing(pageData);
      setCurrentPage(prevPage);
      console.log(`Showing following page ${prevPage} of ${totalPages}`);
    }
  };

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator animating color="#9C27B0" style={{ marginVertical: 20 }} />;
    }

    if (following.length > 0) {
      return (
        <View style={styles.paginationContainer}>
          <View style={styles.paginationButtons}>
            <Button
              mode="contained"
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
              style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
              icon="chevron-left"
            >
              Previous
            </Button>

            <Text style={styles.paginationText}>
              Page {currentPage} of {totalPages}
            </Text>

            <Button
              mode="contained"
              onPress={handleNextPage}
              disabled={currentPage >= totalPages}
              style={[styles.paginationButton, currentPage >= totalPages && styles.disabledButton]}
              icon="chevron-right"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              Next
            </Button>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderHeader = () => (
    <>
      <Text style={styles.followersTitle}>Following</Text>
      <View style={styles.countersContainer}>
        <View style={styles.counterBox}>
          <Text style={styles.counterNumber}>{totalCount}</Text>
          <Text style={styles.counterLabel}>Total Following</Text>
        </View>
      </View>
    </>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={[styles.title, { marginTop: 10 }]}>Loading following...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.followersContainer}
      data={following}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <UserListItemView
          user={item}
          showFollowButton={true}
          onPress={() => {
            console.log('Following list: Navigating to Feed for:', item.username, item.id);
            navigation.navigate('Feed', { userId: item.id });
          }}
        />
      )}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<Text style={styles.emptyText}>You are not following anyone yet</Text>}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#9C27B0']} />
      }
    />
  );
};

export default Following;
