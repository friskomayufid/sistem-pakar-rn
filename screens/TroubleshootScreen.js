import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import * as Progress from "react-native-progress";
import { db } from "../lib/firebase";
import { useNavigation } from '@react-navigation/native'

const TroubleshootScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setLoading] = useState(false);
  const [indications, setIndications] = useState([]);
  const [problems, setProblems] = useState([]);
  const [rules, setRules] = useState([]);

  // INDICATIONS
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "indications"));
      let arrDoc = [];
      querySnapshot.forEach((doc) => {
        arrDoc.push(doc.data());
      });

      // sort data
      let indications = arrDoc.sort(function (a, b) {
        return ("" + a.code).localeCompare(b.code);
      });

      setIndications(indications);
      setLoading(false);
    };

    fetchData();
  }, []);

  // PROBLEMS
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "problems"));
      let arrDoc = [];
      querySnapshot.forEach((doc) => {
        arrDoc.push(doc.data());
      });

      // sort data
      let problems = arrDoc.sort(function (a, b) {
        return ("" + a.code).localeCompare(b.code);
      });

      setProblems(problems);
    };

    fetchData();
  }, []);

  // RULES
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "rules"));
      let arrDoc = [];
      querySnapshot.forEach((doc) => {
        arrDoc.push(doc.data());
      });

      // sort data
      let rules = arrDoc.sort(function (a, b) {
        return ("" + a.id).localeCompare(b.id);
      });

      setRules(rules);
    };

    fetchData();
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState([]);
  const [probability, setProbability] = useState([]);
  const [allHasil, setAllHasil] = useState([]);
  const [currentHasil, setCurrentHasil] = useState(0);
  const [repeatHasil, setRepeatHasil] = useState(false);

  const handleAnswerClick = (answer) => {
    if (answer === true) {
      setScore(score + 1);
      setSelected([...selected, indications[currentQuestion]]);
    }

    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);

    if (nextQuestion < indications.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      if (selected.length > 0) {
        setShowScore(true);
        calculate();
      } else {
        alert('Wajib memilih minimal 1 gejala, silahkan ulangi')
        navigation.navigate('Home')
      }
    }
  };

  const handleNext = () => {
    if (currentHasil === 6) {
      setRepeatHasil(true)
    }

    setCurrentHasil(currentHasil + 1);
  };

  const handleRepeat = () => {
    setRepeatHasil(false)
    setCurrentHasil(0)
  }

  const calculate = () => {
    let probGejala = [];
    let total = [];

    // HITUNG Probabilitas Penyakit Gejala
    rules.map((item) => {
      selected.map((se) => {
        if (item.code_indication === se.code) {
          probGejala.push(item);
        }
      });
    });

    probGejala.map((item) => {
      selected.map((se) => {
        if (item.code_indication === se.code) {
          problems.map((p) => {
            if (item.code_problem === p.code) {
              let nilaiProb = parseFloat(item.value) * parseFloat(p.weight);
              let prob = {
                code_indication: item.code_indication,
                code_problem: item.code_problem,
                value: nilaiProb,
              };
              total.push(prob);
            }
          });
        }
      });
    });

    // HITUNG Total Probabilitas Gejala
    let objectTotal = total;
    var holder = {};

    objectTotal.forEach(function (d) {
      if (holder.hasOwnProperty(d.code_indication)) {
        holder[d.code_indication] =
          parseFloat(holder[d.code_indication]) + parseFloat(d.value);
      } else {
        holder[d.code_indication] = d.value;
      }
    });

    var countGejala = [];

    for (var prop in holder) {
      countGejala.push({
        code_indication: prop,
        value: holder[prop].toFixed(2),
      });
    }

    // HITUNG Probabilitas tiap penyakit gejala
    let bobotPenyakitGejala = [];
    objectTotal.forEach((item) => {
      problems.map((penyakit) => {
        if (item.code_problem === penyakit.code) {
          countGejala.map((gejala) => {
            if (item.code_indication === gejala.code_indication) {
              let hasil = item.value / gejala.value;
              let prob = {
                code_indication: item.code_indication,
                code_problem: item.code_problem,
                value: hasil,
              };
              bobotPenyakitGejala.push(prob);
            }
          });
        }
      });
    });

    // Totalkan Probabilitas tiap penyakit gejala
    var hasilPenyakit = {};

    bobotPenyakitGejala.forEach(function (d) {
      if (hasilPenyakit.hasOwnProperty(d.code_problem)) {
        hasilPenyakit[d.code_problem] =
          parseFloat(hasilPenyakit[d.code_problem]) + parseFloat(d.value);
      } else {
        hasilPenyakit[d.code_problem] = d.value;
      }
    });

    var hasilSemuaPenyakit = [];

    for (var prop in hasilPenyakit) {
      hasilSemuaPenyakit.push({
        code_problem: prop,
        value: hasilPenyakit[prop],
      });
    }

    // HITUNG Total Bayes Penyakit
    let totalBayes = 0;
    hasilSemuaPenyakit.map((hitung) => {
      totalBayes += parseFloat(hitung.value);
    });

    // HITUNG PRESENTASI BAYES KERUSAKAN
    let hasilPersen = [];
    hasilSemuaPenyakit.map((problem) => {
      let hasil = (parseFloat(problem.value) / totalBayes) * 100;
      hasilPersen.push({
        problem: problem.code_problem,
        value: hasil.toFixed(2),
      });
    });

    setProbability(hasilPersen);

    // SORTING PRESENTASI TERTINGGI
    let hasil = hasilPersen.sort(
      (a, b) => parseFloat(b.value) - parseFloat(a.value)
    );

    let semuaHasil = [];
    problems.map((item) => {
      hasil.map((res) => {
        if (item.code === res.problem) {
          semuaHasil.push({
            nama: item.name,
            keterangan: item.desc,
            value: res.value,
            image: item.image,
          });
        }
      });
    });

    let fixHasil = semuaHasil.sort((a, b) => b.value - a.value);

    setAllHasil(fixHasil);

  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {showScore ? (
          <View>
            <Text
              style={{
                marginTop: 10,
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Hasil Troubleshoot
            </Text>
            <View style={{ alignItems: "center" }}>
              <Image
                style={styles.image}
                source={{
                  uri: allHasil[currentHasil].image,
                }}
              />
              <Text style={{ marginTop: 10, fontSize: 18 }}>
                {allHasil[currentHasil].nama}
              </Text>
              <Text style={{ marginTop: 10 }}>
                Prediksi : {allHasil[currentHasil].value} %
              </Text>
              <Text style={{ marginTop: 10 }}>
                {allHasil[currentHasil].keterangan}
              </Text>

              {repeatHasil ? (
                <>
                  <Text style={{ marginTop: 10 }}>Masalah belum selesai?</Text>
                  <TouchableOpacity
                    onPress={handleRepeat}
                    style={styles.button}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>Coba Ulangi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={styles.buttonHome}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>Kembali ke Dashboard</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{ marginTop: 10 }}>Masalah belum selesai?</Text>
                  <TouchableOpacity
                    onPress={handleNext}
                    style={styles.button}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>Langkah selanjutnya</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* <FlatList
              data={probability}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                  <Text>Kode Problem: {item.problem}</Text>
                  <Text>Hasil: {item.value} %</Text>
                </View>
              )}
            ></FlatList> */}
          </View>
        ) : (
          <>
            <View className="question-section">
              <Progress.Bar
                progress={currentQuestion * 0.06}
                height={10}
                width={null}
                style={styles.progress}
              />
              <View>
                <Text style={styles.questionCount}>
                  {currentQuestion + 1} / {indications.length}
                </Text>
              </View>
              <View>
                <Text style={styles.questionText}>
                  {indications[currentQuestion]?.name}
                </Text>
              </View>
            </View>
            <View className="answer-section">
              <TouchableOpacity
                onPress={() => handleAnswerClick(true)}
                style={styles.button}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Ya</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAnswerClick(false)}
                style={styles.button}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Tidak</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default TroubleshootScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    // justifyContent: "center",
    // alignItems: "center",
  },
  progress: {
    marginTop: 20,
    width: "100%",
  },
  questionCount: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  questionText: {
    fontSize: 24,
    marginTop: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonHome: {
    backgroundColor: "#ff5b34",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  image: {
    width: 200,
    height: 230,
    marginTop: 20,
    textAlign: "center",
  },
});
