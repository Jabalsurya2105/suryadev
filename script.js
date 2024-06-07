import { Router } from 'express';
import fs from 'fs';

const router = new Router();
let pathname = 'data.json';
let database = JSON.parse(fs.readFileSync(pathname))

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
date: `${dayOfWeek}, ${day}/${month}/${year}`,
time: timeNow
}
database.push(result)
fs.writeFileSync(pathname, JSON.stringify(database, null, 2))
res.json({
status: 200, 
creator: 'SuryaDev',
result: result
});
})

router.get('/notif/data', (req, res) => {
let data = database;
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

export default router;