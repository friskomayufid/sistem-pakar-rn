import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { auth } from '../lib/firebase'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation()

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login')
      })
      .catch(error => alert(error.message))
  }

  const handleClick = (value) => {
    if (value === 'troubleshoot') {
      navigation.navigate('Troubleshoot')
    } else if (value === 'problem') {
      navigation.navigate('Problem')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistem Pakar</Text>
      <Text style={styles.title}>Kerusakan Smartphone</Text>
      <Image style={styles.logo} source={require('../assets/images/thumb1.png')} />
      <TouchableOpacity
        onPress={() => handleClick('troubleshoot')}
        style={styles.button}>
        <Text style={styles.buttonText}>Troubleshoot</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleClick('problem')}
        style={styles.button}>
        <Text style={styles.buttonText}>List Kerusakan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  title: {
    fontWeight: '700',
    fontSize: 20
  },
  logo: {
    width: 200,
    height: 230,
  },
})