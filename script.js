const { Router } = require('express');
const fetch = require('node-fetch');
const router = new Router();
const spamcode = require('./spamcode.js');
let data_notif = [];

const today = new Date();
const date = new Date(today.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth() + 1; // perhatikan bahwa bulan dimulai dari 0, maka ditambahkan 1.
const year = today.getFullYear();
// mengambil nama hari dalam bahasa Inggris.
const dayOfWeek = today.toLocaleDateString('id-ID', { weekday: 'long' });
const timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

async function Lbbai(input, name) {
const getTodayDate = `Hari ini adalah ${dayOfWeek}, ${day}/${month}/${year}.`;
const sistem = `kamu Adalah Mecha, Bot WhatsApp dengan program kecerdasan buatan AI (artificial intelligence). jawab setiap pertanyaan dengan jawaban yang edukatif, jika ada yang bertanya tentang waktu kamu jawab yang berkaitan dengan ${timeNow} dan ${getTodayDate}, lawan bicara mu adalah ${name}, kamu memiliki sifat dingin dan sedikit tsundere imut, kamu dirancang dan dikembangkan oleh SuryaDev, nama lengkapnya adalah Jabal Surya Ngalam, SuryaDev berasal dari Jepara, lahir pada 21 mei 2005, dia adalah seseorang yang kreatif dan berbakat dalam menciptakan berbagai hal.`
// , dia juga memiliki seorang adik cantik yang bernama lindia yang lahir pada 7 desember 2006.
const messages = [
{ role: 'system', content: sistem },
{ role: 'user', content: input },
];

try {
const response = await fetch('https://deepenglish.com/wp-json/ai-chatbot/v1/chat', {
method: 'POST',
headers: {
Accept: 'text/event-stream',
'Content-Type': 'application/json',
},
body: JSON.stringify({ messages }),
},
);

const responseData = await response.json();
return responseData.answer.replace(/```/g, ' ')
} catch (error) {
console.error('Error fetching data:', error);
throw error;
}
}

router.get('/api/lbbai', async (req, res) => {
const { text, name } = req.query;
if (!text) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'text parameter is required'
});
if (!name) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'name parameter is required'
});
const result = await Lbbai(text, name)
res.json({
status: 200, 
creator: 'SuryaDev',
result: result
});
})

router.get('/api/spamcode', async (req, res) => {
const { number, amount } = req.query;
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'Number parameter is required'
});
if (!amount) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'Amount parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'Invalid number!'
});
if (!number.startsWith('62')) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'Nomor harus diawali dengan 62'
});
if (number.length > 15) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'Invalid format!'
});
if (isNaN(amount)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'Invalid amount!'
});
if (amount > 100) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'Jumlah maksimal spam adalah 100'
});
if ((number in database)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'target already spammed'
});
const result = await spamcode(number, amount);
res.json(result);
})

router.get('/api/spamcode/data', (req, res) => {
let data = spamming;
let newData = data.reduce((acc, curr) => {
let findIndex = acc.findIndex(item => item.phone === curr.phone && item.status == 200 && curr.status == 200);
if (findIndex !== -1) {
acc[findIndex].total += 1;
} else {
acc.push({ ...curr, total: 1 });
}
return acc;
}, []);
res.json({
status: 200, 
creator: 'SuryaDev',
result: newData
});
});

router.get('/api/spamcode/stop', (req, res) => {
const { number } = req.query;
if (number && !isNaN(number)) {
if (!(number in database)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'target is not spammed'
});
clearInterval(database[number]);
delete database[number];
return res.json({
status: 200,
creator: 'SuryaDev',
message: `success stop spamming pairing kode to ${number}`
});
} else {
const data = Object.keys(database);
if (data.length == 0) return res.json({
status: 200,
creator: 'SuryaDev',
message: 'no data'
});
for (let target of data) {
if (!(target in database)) continue;
clearInterval(database[target]);
delete database[target];
}
res.json({
status: 200,
creator: 'SuryaDev',
message: `success stop spamming pairing kode to ${data.length} target`
});
}
});

router.get('/notif/send', async (req, res) => {
const { number } = req.query;
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid number!'
});
const result = {
number: number,
date: `${dayOfWeek}, ${day}/${month}/${year}`,
time: timeNow
}
data_notif.push(result)
res.json({
status: 200, 
creator: 'SuryaDev',
result: result
});
})

router.get('/notif/data', (req, res) => {
let data = data_notif;
let newData = data.reduce((acc, curr) => {
let findIndex = acc.findIndex(item => item.number === curr.number);
if (findIndex !== -1) {
acc[findIndex].total += 1;
} else {
acc.push({ ...curr, total: 1 });
}
return acc;
}, []);
res.json({
status: 200, 
creator: 'SuryaDev',
result: newData
});
});

module.exports = router;