const { WebcastPushConnection } = require('tiktok-live-connector');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const tiktokUsername = process.env.TIKTOK_USERNAME;

const bot = new TelegramBot(token, { polling: false });
let isLive = false;

app.get('/', (req, res) => res.send('Bot is Running!'));
app.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
    startMonitor();
});

function startMonitor() {
    let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);
    tiktokLiveConnection.connect().then(state => {
        if (!isLive) {
            bot.sendMessage(chatId, `🔴 بدأ البث الآن: https://www.tiktok.com/@${tiktokUsername}/live`);
            isLive = true;
        }
    }).catch(err => {
        isLive = false;
        setTimeout(startMonitor, 30000); // يفحص كل 30 ثانية
    });

    tiktokLiveConnection.on('streamEnd', () => {
        isLive = false;
        setTimeout(startMonitor, 30000);
    });
}
