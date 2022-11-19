// FIREBASE EXAMPLE CREATE DATA

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

async function create() {
	tb_aturan.map(async item => {
		await setDoc(doc(db, "rules", item.ID), {
			code_problem: item.kode_penyakit,
			code_indication: item.kode_gejala,
			value: item.nilai
		}).then(() => console.log(`success ${item.ID}`));
	})
}

create()