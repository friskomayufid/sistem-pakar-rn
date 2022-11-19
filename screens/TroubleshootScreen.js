import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

const TroubleshootScreen = () => {
  const [indications, setIndications] = useState([]);
  const [problems, setProblems] = useState([]);
  const [rules, setRules] = useState([]);

  // INDICATIONS
  useEffect(() => {
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
  const [hasil, setHasil] = useState({});
  const [probability, setProbability] = useState([]);
  const [allHasil, setAllHasil] = useState([]);

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
      setShowScore(true);
      calculate();
    }
  };

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

    setAllHasil(hasil);

    problems.map((item) => {
      if (item.code === hasil[0].problem) {
        setHasil({
          nama: item.name,
          keterangan: item.desc,
          value: hasil[0].value,
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {showScore ? (
        <View>
          <Text style={{ marginTop: 10 }}>Hasil Kerusakan : {hasil.nama}</Text>
          <Text>Keterangan : {hasil.keterangan}</Text>
          <Text>Total Kemungkinan : {hasil.value}</Text>

          <FlatList
            data={probability}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Text>Kode Problem: {item.problem}</Text>
                <Text>Hasil: {item.value} %</Text>
              </View>
            )}
          ></FlatList>
        </View>
      ) : (
        <>
          <View className="question-section">
            <View className="question-count">
              <Text>
                Question {currentQuestion + 1} / {indications.length}
              </Text>
            </View>
            <View className="question-text">
              <Text>{indications[currentQuestion]?.name}</Text>
            </View>
          </View>
          <View className="answer-section">
            <TouchableOpacity
              onPress={() => handleAnswerClick(true)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAnswerClick(false)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default TroubleshootScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
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
});
