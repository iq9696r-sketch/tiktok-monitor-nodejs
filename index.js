const { target_user_live } = require('tik-live-status');
const axios = require('axios');

// استبدل هذه القيم ببياناتك أو تأكد من ضبطها في Secrets
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TIKTOK_USER = "ضع_اسم_المستخدم_هنا"; 

async function sendTelegramMessage(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'HTML'
        });
        console.log("Notification sent successfully!");
    } catch (error) {
        console.error("Error sending to Telegram:", error.message);
    }
}

async function checkLive() {
    console.log(`Checking live status for: ${TIKTOK_USER}...`);
    try {
        const liveStatus = await target_user_live(TIKTOK_USER);
        
        if (liveStatus && liveStatus.live) {
            console.log("User is LIVE!");
            await sendTelegramMessage(`🚨 <b>${TIKTOK_USER}</b> فاتح بث الآن! \n\nرابط البث: https://www.tiktok.com/@${TIKTOK_USER}/live`);
        } else {
            console.log("User is offline.");
        }
    } catch (error) {
        console.error("Error checking TikTok status:", error.message);
    }
}

// تنفيذ الفحص مرة واحدة فقط
checkLive().then(() => {
    console.log("Check completed.");
    process.exit(0); // إغلاق السكربت بنجاح
});
