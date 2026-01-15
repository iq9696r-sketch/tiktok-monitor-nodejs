const { target_user_live } = require('tik-live-status');
const axios = require('axios');

// جلب المتغيرات السرية من إعدادات GitHub
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// تأكد من أن اسم المستخدم هنا صحيح (بدون @)
const TIKTOK_USER = process.env.TIKTOK_USERNAME || "اسم_المستخدم_الاحتياطي"; 

async function sendTelegramMessage(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: false
        });
        console.log("✅ Notification sent successfully!");
    } catch (error) {
        console.error("❌ Error sending to Telegram:", error.response ? error.response.data : error.message);
    }
}

async function checkLive() {
    console.log(`🔎 Checking live status for: ${TIKTOK_USER}...`);
    try {
        // هذه الدالة تفحص الحالة وترجع النتيجة فوراً
        const liveStatus = await target_user_live(TIKTOK_USER);
        
        if (liveStatus && liveStatus.live) {
            console.log("🔴 User is LIVE!");
            const msg = `🚨 <b>تنبيه بث مباشر!</b>\n\nالمستخدم: <b>${TIKTOK_USER}</b> بدأ بثاً مباشراً الآن!\n\n<a href="https://www.tiktok.com/@${TIKTOK_USER}/live">اضغط هنا للمشاهدة</a>`;
            await sendTelegramMessage(msg);
        } else {
            console.log("zzZ User is offline.");
        }
    } catch (error) {
        console.error("⚠️ Error checking TikTok status:", error.message);
    }
}

// تشغيل الفحص ثم إنهاء العملية فوراً لتوفير الموارد
checkLive().then(() => {
    console.log("🏁 Process finished.");
    process.exit(0);
});
