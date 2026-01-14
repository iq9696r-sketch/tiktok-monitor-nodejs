const { WebcastPushConnection } = require('tiktok-live-connector');
const axios = require('axios');
const http = require('http'); // أضفنا هذا لبقاء التطبيق حياً

// إعدادات البيئة
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const tiktokUsername = process.env.TIKTOK_USERNAME;

// 1. خادم وهمي لإبقاء Koyeb يعمل (Healthy)
http.createServer((req, res) => {
    res.write('TikTok Monitor is running!');
    res.end();
}).listen(process.env.PORT || 8080);

async function checkLive() {
    console.log(`Checking status for: ${tiktokUsername}...`);
    let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);
    try {
        await tiktokLiveConnection.connect();
        const message = `🔴 الحساب ${tiktokUsername} مفتوح الآن بث مباشر! \n رابط البث: https://www.tiktok.com/@${tiktokUsername}/live`;
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message
        });
        console.log("Live notification sent!");
        // بعد إرسال التنبيه، نفصل الاتصال حتى لا يستهلك الموارد
        tiktokLiveConnection.disconnect();
    } catch (err) {
        console.log("User is offline");
    }
}

// 2. تشغيل الفحص فوراً عند البدء
checkLive();

// 3. إعادة الفحص كل دقيقتين (120000 ميلي ثانية) لضمان استمرار العمل
setInterval(checkLive, 120000);
