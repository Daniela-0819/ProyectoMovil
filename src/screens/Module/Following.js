import React, { useEffect, useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../config/firebase";
import UserListItemView from "../Views/UserListItem";
import styles from "../../Styles/styles";

const Following = ({ route }) => {
  const { user } = route.params;
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "users"), orderBy("fullName"), limit(10));
      const snapshot = await getDocs(q);
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFollowing(usersList);
    } catch (error) {
      console.error("Error loading following:", error);
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
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={[styles.title, { marginTop: 10 }]}>
          Loading following...
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
      <Text style={styles.followersTitle}>Following</Text>

      {following.length === 0 ? (
        <Text style={styles.emptyText}>
          You are not following anyone yet 😅
        </Text>
      ) : (
        following.map((user) => (
          <UserListItemView
            key={user.id}
            user={user}
            showFollowButton={false}
          />
        ))
      )}
    </ScrollView>
  );
};

export default Following;
