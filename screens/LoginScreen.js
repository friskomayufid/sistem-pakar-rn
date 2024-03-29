import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../lib/firebase'
import { useNavigation } from '@react-navigation/native'
// import { addDoc, doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore" 
// import moment from 'moment'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoginScreen = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const navigation = useNavigation()

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if(user) {
				navigation.replace("Home")
			}
		})

		return unsubscribe
	}, [])

	const handleLogin = () => {
		auth
		.signInWithEmailAndPassword(email, password)
		.then(userCredentials => {
			const user = userCredentials.user
			console.log('Logged in with', user.email)
		})
		.catch(error => alert(error.message))
	}

	return (
		<SafeAreaView
			style={styles.container}
			behavior="padding"
		>
			<View style={styles.inputContainer}>
        <Text style={styles.title}>Masuk</Text>
				<TextInput
					placeholder='Email'
					value={email}
					onChangeText={text => setEmail(text)}
					style={styles.input}
				></TextInput>
			</View>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder='Password'
					value={password}
					onChangeText={text => setPassword(text)}
					style={styles.input}
					secureTextEntry
				></TextInput>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={handleLogin}
					style={styles.button}
				>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
				<Text style={styles.text}>Belum Punya Akun?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.underLineText}>Daftar Disini</Text>
        </TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
	inputContainer: {
		width: '80%'
	},
	input: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
	buttonContainer: {
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,
	},
	button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center'
	},
	buttonOutline: {
		backgroundColor: 'white',
		marginTop: 5,
		borderColor: '#0782F9'
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16
	},
	buttonOutlineText: {
		color: '#0782F9',
		fontWeight: '700',
		fontSize: 16
	},
	text: {
    marginTop: 20,
  },
  underLineText: {
    color: "#0782F9",
    fontWeight: "bold",
    textAlign: "center",
  },
})