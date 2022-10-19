import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const TroubleshootScreen = () => {
  const questions = [
    {
      questionText: 'Apakah LCD Pecah?',
      answer: false,
    },
    {
      questionText: 'Apakah Masih bisa di charger?',
      answer: false,
    },
    {
      questionText: 'Apakah HP mati total?',
      answer: false,
    },
    {
      questionText: 'Apakah HP hang?',
      answer: false,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerClick = (answer) => {
    if(answer === true) {
      setScore(score + 1)
    }

    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion)

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

  return (
    <View style={styles.container}>
      {showScore ? (
        <Text>You scored {score} out of {questions.length}</Text>
      ) : (
        <>
          <View className='question-section'>
            <View className='question-count'>
              <Text>Question {currentQuestion + 1} / {questions.length}</Text>
            </View>
            <View className='question-text'>
              <Text>{questions[currentQuestion].questionText}</Text>
            </View>
          </View>
          <View className='answer-section'>
            <TouchableOpacity
              onPress={() => handleAnswerClick(true)}
              style={styles.button}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAnswerClick(false)}
              style={styles.button}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

export default TroubleshootScreen

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
})