import { StyleSheet, View, Text, Image } from "react-native";
import React from "react";

const DetailProblemScreen = ({ route }) => {
  const { data } = route.params;
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: data.image,
        }}
      />
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.desc}>{data.desc}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    width: "80%",
  },
  desc: {
    fontSize: 16,
    textAlign: "justify",
    marginTop: 20,
    width: "80%",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default DetailProblemScreen;
