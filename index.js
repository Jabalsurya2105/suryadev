import express from 'express';
import cors from 'cors';
import path from 'path'
import ejs from 'ejs'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import apiRoutes from './script.js';

const app = express();
var database = [];

// settings
app.set('port', process.env.PORT || 4000);

// middlewares
app.enable('trust proxy');
app.set('json spaces', 2)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(cors())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.get('/', (req, res) => {
res.render('home')
});

app.get('/messages', (req, res) => {
const data = database;
res.json({ status: 200, result: data });
});

app.post('/messages', (req, res) => {
const { number, name, message } = req.body;
if (!number) {
return res.status(400).send('Number is required');
};
if (!name) {
return res.status(400).send('Name is required');
};
if (!message) {
return res.status(400).send('Message is required');
};
let obj = {
number: number.replace(/[^0-9]/g, '') + '@s.whatsapp.net',
name: name,
message: message
}
database.push(obj);
res.redirect('/');
});

app.post('/send', (req, res) => {
const { number, name, message } = req.body;
if (!message) return res.status(400).send('Message is required');
let obj = {
number: number.replace(/[^0-9]/g, '') + '@s.whatsapp.net',
name: name,
message: message
}
database.push(obj);
res.redirect('/');
});

app.get('/delete/messages', (req, res) => {
database = []
res.redirect('/');
});

app.use('/', apiRoutes)

// starting the server
app.listen(app.get('port'), () => {
console.log(`Server on port ${app.get('port')}`);
});