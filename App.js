import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TroubleshootScreen from './screens/TroubleshootScreen';
import ProblemScreen from './screens/ProblemScreen';
import { collection, addDoc } from "firebase/firestore";
import { db } from './lib/firebase';
import DetailProblemScreen from './screens/DetailProblemScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // async function createData() {
    //   try {
    //     const docRef = await addDoc(collection(db, "problems"), {
    //       title: "Kerusakan LCD",
    //       description: "LCD (Liquid Crystal Display) merupakan komponen utama dari sebuah smartphone. Saat ini mayoritas produsen menggunakan layar sentuh sebagai cara mengoperasikan smartphone produksinya. Komponen ini pun tidak lepas dari beragam masalah seperti tergores, bergaris, berkedip, retak, dan bahkan pecah.",
    //       indication: {
    //         0: "LCD Tergores",
    //         1: "Ghost Touching",
    //         2: "Screen Flickering",
    //         3: "Dead Pixel"
    //       }
    //     });
    //     console.log("Document written with ID: ", docRef.id);
    //   } catch (e) {
    //     console.error("Error adding document: ", e);
    //   }
    // }

    // createData()

  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen name="Troubleshoot" component={TroubleshootScreen} />
        <Stack.Screen name="Problem" component={ProblemScreen} />
        <Stack.Screen name="DetailProblem" component={DetailProblemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
