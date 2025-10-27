import React from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import styles from "../../Styles/styles";

const ProfileView = ({ user }) => (
  <View style={styles.headerContainer}>
    <Avatar.Text
      size={100}
      label={user?.username?.[0]?.toUpperCase() || "?"}
      style={{ backgroundColor: "#9C27B0" }}
    />
    <Text style={styles.profileName}>@{user?.username}</Text>
  </View>
);

export default ProfileView;
