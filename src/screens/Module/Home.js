import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { auth } from "../../config/firebase";
import ForYou from "./ForYou";
import FollowingTweets from "./FollowingTweets";
import styles from "../../Styles/styles";

const Home = ({ navigation }) => {
  const [tab, setTab] = useState("foryou");

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#faf7ff" }}>
        <Appbar.Content
          title="VIBES"
          titleStyle={{ color: "#9C27B0", fontWeight: "bold", fontSize: 22 }}
        />
        <Appbar.Action
          icon="account-circle"
          color="#9C27B0"
          onPress={() =>
            navigation.navigate("Feed", { userId: auth.currentUser.uid })
          }
        />
      </Appbar.Header>

      {/* Scrollable container */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <Button
            mode={tab === "foryou" ? "contained" : "outlined"}
            textColor={tab === "foryou" ? "#fff" : "#9C27B0"}
            buttonColor={tab === "foryou" ? "#9C27B0" : "transparent"}
            onPress={() => setTab("foryou")}
            style={{
              marginRight: 10,
              borderColor: "#9C27B0",
              borderRadius: 10,
            }}
            labelStyle={{
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            For You
          </Button>

          <Button
            mode={tab === "following" ? "contained" : "outlined"}
            textColor={tab === "following" ? "#fff" : "#9C27B0"}
            buttonColor={tab === "following" ? "#9C27B0" : "transparent"}
            onPress={() => setTab("following")}
            style={{
              borderColor: "#9C27B0",
              borderRadius: 10,
            }}
            labelStyle={{
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Following
          </Button>
        </View>

        {/* Dynamic content */}
        {tab === "foryou" ? <ForYou /> : <FollowingTweets />}
      </ScrollView>
    </View>
  );
};

export default Home;