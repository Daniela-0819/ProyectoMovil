import React, { useEffect, useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../config/firebase";
import UserListItemView from "../Views/UserListItem";
import styles from "../../Styles/styles";

const Followers = ({ route }) => {
  const { user } = route.params;
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowers = async () => {
    try {
      //simulation
      setLoading(true);
      const q = query(collection(db, "users"), orderBy("fullName"), limit(10));
      const snapshot = await getDocs(q);
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFollowers(usersList);
    } catch (error) {
      console.error("Error loading followers:", error);
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

  const handleFollow = (targetUser) => {
    console.log("Followed:", targetUser.username);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={[styles.title, { marginTop: 10 }]}>
          Loading followers...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.followersContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.followersTitle}>Followers</Text>

      {followers.length === 0 ? (
        <Text style={styles.emptyText}>You don't have followers yet 😅</Text>
      ) : (
        followers.map((follower) => (
          <UserListItemView
            key={follower.id}
            user={follower}
            showFollowButton
            onFollow={handleFollow}
          />
        ))
      )}
    </ScrollView>
  );
};

export default Followers;
