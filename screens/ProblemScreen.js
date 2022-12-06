import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const ProblemScreen = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "problems"));
      let arrDoc = [];
      querySnapshot.forEach((doc) => {
        arrDoc.push(doc.data());
      });

      setData(arrDoc);
    };

    fetchData();
  }, []);

  const Item = ({ data }) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DetailProblem", { data: data });
        }}
        style={styles.item}
      >
        <Image
          style={styles.image}
          source={{
            uri: data.image,
          }}
        />
        <Text style={styles.title}>{data.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => <Item key={item} data={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
};

export default ProblemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "80%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    paddingRight: 20,
    marginRight: 10,
  },
});
