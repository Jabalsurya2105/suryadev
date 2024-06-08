import { Router } from 'express';

const router = new Router();
var database = [];
var notification = [];

router.get('/notif/send', async (req, res) => {
const { number, name } = req.query;
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (!name) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'name parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid number!'
});
const result = {
number: number,
name: name,
date: timezone().date,
time: timezone().time
}
database.push(result)
notification.push(result)
res.json({
status: 200, 
creator: 'SuryaDev',
result: result
});
})

router.get('/notif/get', (req, res) => {
const data = notification;
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/notif/reset', (req, res) => {
notification = [];
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data berhasil di reset.'
});
});

router.get('/notif/data', (req, res) => {
const data = database;
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

function timezone () {
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
return {
date: `${dayOfWeek}, ${day}/${month}/${year}`,
time: timeNow
}
}

export default router;