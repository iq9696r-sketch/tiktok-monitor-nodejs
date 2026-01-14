const { WebcastPushConnection } = require('tiktok-live-connector');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// 1. إعداد السيرفر لإرضاء Koyeb (المنفذ 8080)
const app = express();
const port = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(port, () => console.log(`Server listening on port ${port}`));

// 2. إعداد التلجرام والمتغيرات
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const tiktokUsername = process.env.TIKTOK_USERNAME;
const bot = new TelegramBot(token);

// متغير لمنع إرسال رسائل متكررة للبث نفسه
let isLive = false;

async function checkLive() {
    console.log(`Checking status for: ${tiktokUsername}...`);
    let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);
    
    try {
        await tiktokLiveConnection.connect();
        
        // إذا نجح الاتصال ولم نكن قد أرسلنا تنبيهاً بعد
        if (!isLive) {
            const message = `🔴 الحساب ${tiktokUsername} مفتوح الآن بث مباشر! \n رابط البث: https://www.tiktok.com/@${tiktokUsername}/live`;
            await bot.sendMessage(chat_id, message);
            console.log("Live notification sent!");
            isLive = true; 
        }
        
        // نفصل الاتصال فوراً لتوفير الرام (نحن نحتاج فقط لمعرفة الحالة)
        tiktokLiveConnection.disconnect();
        
    } catch (err) {
        console.log("User is offline");
        isLive = false; // تصفير الحالة ليكون جاهزاً للتنبيه القادم
    }
}

// 3. تشغيل الفحص كل دقيقتين
setInterval(checkLive, 120000);
checkLive(); // فحص فوري عند التشغيل
