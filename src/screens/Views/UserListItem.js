import React from "react";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import styles from "../../Styles/styles";

const UserListItem= ({ user, onFollow, showFollowButton }) => {
  return (
    <View style={styles.userCard}>
      <Avatar.Text
        size={50}
        label={user?.username?.[0]?.toUpperCase() || "?"}
        style={{ backgroundColor: "#9C27B0" }}
      />

      <View style={styles.userInfo}>
        <Text style={styles.userFullName}>{user.fullName}</Text>
        <Text style={styles.userUsername}>@{user.username}</Text>
      </View>

      {showFollowButton && (
        <Button
          mode="contained"
          onPress={() => onFollow(user)}
          style={styles.followButton}
          labelStyle={styles.followButtonLabel}
        >
          Follow
        </Button>
      )}
    </View>
  );
};

export default UserListItem;
