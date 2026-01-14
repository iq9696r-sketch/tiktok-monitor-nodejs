const { WebcastPushConnection } = require('tiktok-live-connector');
const axios = require('axios');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const tiktokUsername = process.env.TIKTOK_USERNAME;

async function checkLive() {
    let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);
    try {
        await tiktokLiveConnection.connect();
        // إذا نجح الاتصال يعني البث مفتوح
        const message = `🔴 الحساب ${tiktokUsername} مفتوح الآن بث مباشر! \n رابط البث: https://www.tiktok.com/@${tiktokUsername}/live`;
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message
        });
        console.log("Live notification sent!");
    } catch (err) {
        console.log("User is offline");
    }
}

checkLive();
