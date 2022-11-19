import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState } from "react";

const TroubleshootScreen = () => {
  const tb_gejala = [
    { kode_gejala: "G01", nama_gejala: "Panas" },
    { kode_gejala: "G02", nama_gejala: "Sakit Kepala" },
    { kode_gejala: "G03", nama_gejala: "Bersin" },
    { kode_gejala: "G04", nama_gejala: "Batuk" },
    { kode_gejala: "G05", nama_gejala: "Pilek, Hidung Buntu" },
    { kode_gejala: "G06", nama_gejala: "Badan Lemas" },
    { kode_gejala: "G07", nama_gejala: "Kedinginan" },
  ];
  const tb_penyakit = [
    {
      kode_penyakit: "P01",
      nama_penyakit: "Anemia",
      bobot: "0.5",
      keterangan:
        "Kondisi ketika darah tidak memiliki sel darah merah sehat yang cukup.",
    },
    {
      kode_penyakit: "P02",
      nama_penyakit: "Bronkitis",
      bobot: "0.6",
      keterangan:
        "Radang selaput saluran bronkial, yang membawa udara ke dan dari paru-paru.",
    },
    {
      kode_penyakit: "P03",
      nama_penyakit: "Demam",
      bobot: "0.6",
      keterangan:
        "Peningkatan sementara suhu tubuh rata-rata menjadi 37°C (98,6°F).",
    },
    {
      kode_penyakit: "P04",
      nama_penyakit: "Flu",
      bobot: "0.7",
      keterangan:
        "Suatu infeksi virus umum yang dapat mematikan, terutama di kelompok risiko tinggi.",
    },
  ];

  const tb_aturan = [
    { ID: "1", kode_penyakit: "P01", kode_gejala: "G01", nilai: "0.2" },
    { ID: "2", kode_penyakit: "P02", kode_gejala: "G01", nilai: "0.7" },
    { ID: "3", kode_penyakit: "P03", kode_gejala: "G01", nilai: "0.7" },
    { ID: "4", kode_penyakit: "P04", kode_gejala: "G01", nilai: "0.6" },
    { ID: "5", kode_penyakit: "P01", kode_gejala: "G02", nilai: "0.9" },
    { ID: "6", kode_penyakit: "P02", kode_gejala: "G02", nilai: "0.1" },
    { ID: "7", kode_penyakit: "P03", kode_gejala: "G02", nilai: "0.2" },
    { ID: "8", kode_penyakit: "P04", kode_gejala: "G02", nilai: "0.5" },
    { ID: "9", kode_penyakit: "P01", kode_gejala: "G03", nilai: "0.2" },
    { ID: "10", kode_penyakit: "P02", kode_gejala: "G03", nilai: "0.7" },
    { ID: "11", kode_penyakit: "P03", kode_gejala: "G03", nilai: "0.2" },
    { ID: "12", kode_penyakit: "P04", kode_gejala: "G03", nilai: "0.75" },
    { ID: "13", kode_penyakit: "P01", kode_gejala: "G04", nilai: "0.2" },
    { ID: "14", kode_penyakit: "P02", kode_gejala: "G04", nilai: "0.9" },
    { ID: "15", kode_penyakit: "P03", kode_gejala: "G04", nilai: "0.2" },
    { ID: "16", kode_penyakit: "P04", kode_gejala: "G04", nilai: "0.2" },
    { ID: "17", kode_penyakit: "P01", kode_gejala: "G05", nilai: "0.2" },
    { ID: "18", kode_penyakit: "P02", kode_gejala: "G05", nilai: "0.3" },
    { ID: "19", kode_penyakit: "P03", kode_gejala: "G05", nilai: "0.2" },
    { ID: "20", kode_penyakit: "P04", kode_gejala: "G05", nilai: "0.9" },
    { ID: "21", kode_penyakit: "P01", kode_gejala: "G06", nilai: "0.95" },
    { ID: "22", kode_penyakit: "P02", kode_gejala: "G06", nilai: "0.3" },
    { ID: "23", kode_penyakit: "P03", kode_gejala: "G06", nilai: "0.7" },
    { ID: "24", kode_penyakit: "P04", kode_gejala: "G06", nilai: "0.3" },
    { ID: "25", kode_penyakit: "P01", kode_gejala: "G07", nilai: "0.2" },
  ];

  const questions = [
    {
      questionText: "Apakah LCD Pecah?",
      answer: false,
    },
    {
      questionText: "Apakah Masih bisa di charger?",
      answer: false,
    },
    {
      questionText: "Apakah HP mati total?",
      answer: false,
    },
    {
      questionText: "Apakah HP hang?",
      answer: false,
    },
  ];

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
      setSelected([...selected, tb_gejala[currentQuestion]]);
    }

    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);

    if (nextQuestion < tb_gejala.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      calculate();
    }
  };

  const calculate = () => {
    let probGejala = [];
    let total = [];
    let countProb = 0;

    // HITUNG Probabilitas Penyakit Gejala
    tb_aturan.map((item) => {
      selected.map((se) => {
        if (item.kode_gejala === se.kode_gejala) {
          probGejala.push(item);
        }
      });
    });

    probGejala.map((item) => {
      selected.map((se) => {
        if (item.kode_gejala === se.kode_gejala) {
          tb_penyakit.map((p) => {
            if (item.kode_penyakit === p.kode_penyakit) {
              let nilaiProb = parseFloat(item.nilai) * parseFloat(p.bobot);
              let prob = {
                kode_gejala: item.kode_gejala,
                kode_penyakit: item.kode_penyakit,
                nilai: nilaiProb
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
      if (holder.hasOwnProperty(d.kode_gejala)) {
        holder[d.kode_gejala] = parseFloat(holder[d.kode_gejala]) + parseFloat(d.nilai);
      } else {
        holder[d.kode_gejala] = d.nilai;
      }
    });

    var countGejala = [];

    for (var prop in holder) {
      countGejala.push({ kode_gejala: prop, value: holder[prop].toFixed(2) });
    }

    console.log(countGejala, 'gejala'); 

    // HITUNG Probabilitas tiap penyakit gejala
    let bobotPenyakitGejala = []
    objectTotal.forEach(item => {
      tb_penyakit.map((penyakit) => {
        if (item.kode_penyakit === penyakit.kode_penyakit) {
          countGejala.map(gejala => {
            if (item.kode_gejala === gejala.kode_gejala) {
              let hasil = item.nilai / gejala.value
              let prob = {
                kode_gejala: item.kode_gejala,
                kode_penyakit: item.kode_penyakit,
                nilai: hasil,
              };
              bobotPenyakitGejala.push(prob);
            }
          })
        }
      })
    })

    console.log(bobotPenyakitGejala, 'penykit gejala')

    // Totalkan Probabilitas tiap penyakit gejala
    var hasilPenyakit = {};

    bobotPenyakitGejala.forEach(function (d) {
      if (hasilPenyakit.hasOwnProperty(d.kode_penyakit)) {
        hasilPenyakit[d.kode_penyakit] = parseFloat(hasilPenyakit[d.kode_penyakit]) + parseFloat(d.nilai);
      } else {
        hasilPenyakit[d.kode_penyakit] = d.nilai;
      }
    });

    var hasilSemuaPenyakit = [];

    for (var prop in hasilPenyakit) {
      hasilSemuaPenyakit.push({ kode_penyakit: prop, nilai: hasilPenyakit[prop] });
    }

    console.log(hasilSemuaPenyakit, 'hasilSemuaPenyakit '); 

    // HITUNG Total Bayes Penyakit
    let totalBayes = 0
    hasilSemuaPenyakit.map(hitung => {
      totalBayes += parseFloat(hitung.nilai)
    })

    console.log(totalBayes, 'totalbayes')

    // HITUNG PRESENTASI BAYES PENYAKIT
    let hasilPersen = []
    hasilSemuaPenyakit.map(penyakit => {
      let hasil = parseFloat(penyakit.nilai) / totalBayes * 100
      hasilPersen.push({
        penyakit: penyakit.kode_penyakit,
        nilai: hasil.toFixed(2),
      })
    })

    setProbability(hasilPersen)

    // SORTING PRESENTASI TERTINGGI
    let hasil = hasilPersen.sort((a, b) => parseFloat(b.nilai) - parseFloat(a.nilai));

    setAllHasil(hasil);

    tb_penyakit.map((item) => {
      if (item.kode_penyakit === hasil[0].penyakit) {
        setHasil({
          nama: item.nama_penyakit,
          keterangan: item.keterangan,
          nilai: hasil[0].nilai,
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {showScore ? (
        <View>
          <Text style={{marginTop: 10}}>Hasil Penyakit : {hasil.nama}</Text>
          <Text>Keterangan : {hasil.keterangan}</Text>
          <Text>Total Kemungkinan : {hasil.nilai}</Text>

          <FlatList
            data={probability}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{marginBottom: 10, marginTop: 10}}>
                <Text>Kode Penyakit: {item.penyakit}</Text>
                <Text>Hasil: {item.nilai} %</Text>
              </View>
            )}
          ></FlatList>
        </View>
      ) : (
        <>
          <View className="question-section">
            <View className="question-count">
              <Text>
                Question {currentQuestion + 1} / {tb_gejala.length}
              </Text>
            </View>
            <View className="question-text">
              <Text>{tb_gejala[currentQuestion].nama_gejala}</Text>
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
