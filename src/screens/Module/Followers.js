import React, { useEffect, useState } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebase';
import UserListItemView from '../Views/UserListItem';
import styles from '../../Styles/styles';

const Followers = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [followers, setFollowers] = useState([]);
  const [allFollowers, setAllFollowers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const USERS_PER_PAGE = 10;

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      
      // Get the IDs of the current user's followers
      const followersRef = collection(db, 'followers', user.uid, 'followers');
      const followersQuery = query(followersRef, orderBy('followedAt', 'desc'));
      const snapshot = await getDocs(followersQuery);

      setTotalCount(snapshot.size);
      console.log(`Total followers: ${snapshot.size}`);

      if (snapshot.empty) {
        setAllFollowers([]);
        setFollowers([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const followerIds = snapshot.docs.map(doc => doc.id);
      const followersData = [];

      // Fetch user details for each follower
      for (const id of followerIds) {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          followersData.push({ id, ...userDoc.data() });
        }
      }

      // to sort alphabetically
      followersData.sort((a, b) => {
      const nameA = (a.fullName || '').toLowerCase();
      const nameB = (b.fullName || '').toLowerCase();
      return nameA.localeCompare(nameB);
      });

      setAllFollowers(followersData);
      setTotalPages(Math.ceil(followersData.length / USERS_PER_PAGE) || 1);

      // Show first page
      const firstPage = followersData.slice(0, USERS_PER_PAGE);
      setFollowers(firstPage);
      setCurrentPage(1);

      console.log(
        `Loaded ${followersData.length} followers, showing page 1 of ${Math.ceil(followersData.length / USERS_PER_PAGE)}`,
      );
    } catch (error) {
      console.error('Error loading followers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [user.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowers();
    setRefreshing(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      const pageData = allFollowers.slice(startIndex, endIndex);

      setFollowers(pageData);
      setCurrentPage(nextPage);
      console.log(`Showing followers page ${nextPage} of ${totalPages}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const startIndex = (prevPage - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      const pageData = allFollowers.slice(startIndex, endIndex);

      setFollowers(pageData);
      setCurrentPage(prevPage);
      console.log(`Showing followers page ${prevPage} of ${totalPages}`);
    }
  };

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator animating color="#9C27B0" style={{ marginVertical: 20 }} />;
    }

    if (followers.length > 0) {
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
      <Text style={styles.followersTitle}>Followers</Text>
      <View style={styles.countersContainer}>
        <View style={styles.counterBox}>
          <Text style={styles.counterNumber}>{totalCount}</Text>
          <Text style={styles.counterLabel}>Total Followers</Text>
        </View>
      </View>
    </>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={[styles.title, { marginTop: 10 }]}>Loading followers...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.followersContainer}
      data={followers}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <UserListItemView
          user={item}
          showFollowButton={true}
          onPress={() => {
            console.log('Followers list: Navigating to Feed for:', item.username, item.id);
            navigation.navigate('Feed', { userId: item.id });
          }}
        />
      )}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<Text style={styles.emptyText}>No followers yet</Text>}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#9C27B0']} />
      }
    />
  );
};

export default Followers;
