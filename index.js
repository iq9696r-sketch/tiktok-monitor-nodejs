const { target_user_live } = require('tik-live-status');
const axios = require('axios');

// جلب البيانات من البيئة (Environment Variables)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// ملاحظة: يمكنك وضع اسم المستخدم هنا مباشرة أو عبر الـ Secrets
const TIKTOK_USER = "اسم_المستخدم_هنا"; 

async function sendTelegramMessage(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'HTML'
        });
        console.log("تم إرسال الإشعار بنجاح!");
    } catch (error) {
        console.error("خطأ في إرسال التليجرام:", error.response ? error.response.data : error.message);
    }
}

async function checkLive() {
    console.log(`جاري فحص حالة البث لـ: ${TIKTOK_USER}...`);
    try {
        const liveStatus = await target_user_live(TIKTOK_USER);
        
        // التحقق مما إذا كان البث مفتوحاً
        if (liveStatus && liveStatus.live) {
            console.log("الحساب مفتوح الآن (LIVE)!");
            await sendTelegramMessage(`🚨 <b>${TIKTOK_USER}</b> فاتح بث الآن! \n\nرابط البث: https://www.tiktok.com/@${TIKTOK_USER}/live`);
        } else {
            console.log("الحساب غير مفتوح حالياً.");
        }
    } catch (error) {
        console.error("حدث خطأ أثناء الفحص:", error.message);
    }
}

// تنفيذ الفحص مرة واحدة وإغلاق السكربت
checkLive().then(() => {
    console.log("انتهت عملية الفحص.");
    process.exit(0); 
});
