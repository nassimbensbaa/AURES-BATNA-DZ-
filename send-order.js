export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const data = req.body;

  const message = `
🛒 طلب جديد:
👤 الاسم: ${data.firstName} ${data.lastName}
📞 الهاتف: ${data.phone}
📍 الولاية: ${data.state}
🚚 التوصيل: ${data.deliveryType}
💰 الإجمالي: ${data.total} دج
📦 المنتج: ${data.productName}
`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    const result = await response.json();

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
}