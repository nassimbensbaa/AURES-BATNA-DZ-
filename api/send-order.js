module.exports = async function handler(req, res) {
    // السماح فقط بـ POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'الطريقة غير مسموحة' });
    }

    try {
        // التوكن موجود في متغيرات البيئة (Environment Variables)
        const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // التحقق من وجود التوكن في البيئة
        if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('الرجاء إضافة TELEGRAM_TOKEN و TELEGRAM_CHAT_ID في متغيرات البيئة');
            return res.status(500).json({ success: false, error: 'خطأ في إعدادات الخادم' });
        }

        const orderData = req.body;
        
        // رسالة لإرسالها إلى التلغرام
        const message = `🌟 *طلب جديد من المتجر* 🌟
━━━━━━━━━━━━━━━━━━━
👤 *العميل:* ${orderData.firstName} ${orderData.lastName}
📞 *الهاتف:* ${orderData.phone}
📍 *الولاية:* ${orderData.state}
🚚 *نوع التوصيل:* ${orderData.deliveryType === 'office' ? '📦 مكتب' : '🏠 منزل'}
💰 *سعر التوصيل:* ${orderData.shipping} دج
💎 *المجموع الكلي:* ${Math.round(orderData.total)} دج
🛍️ *المنتج:* ${orderData.productName}
━━━━━━━━━━━━━━━━━━━
📅 *التاريخ:* ${new Date().toLocaleString('ar-DZ')}`;

        // إرسال إلى تيليجرام
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();

        if (result.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, error: result.description });
        }
    } catch (error) {
        console.error('خطأ في API:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};