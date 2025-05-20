import axios from "axios";

type Data = {
  name: string;
  url: string;
  newPrice: number;
  oldPrice: number;
};

const notification = {
  WELCOME: "WELCOME",
  ALERT_PRICE: "ALERT_PRICE",
  NEW_PRODUCT: "NEW_PRODUCT",
};

export function generateBotMessage(data: Data, notify: string) {
  let message = "";
  const { name, oldPrice, newPrice, url } = data;

  switch (notify) {
    case notification.WELCOME:
      message = `
            👋 *Welcome to Price Tracker Bot!*

            I'll help you track product prices and alert you when they drop. Here's what you can do:

            🔹 Add a product to track  
            🔹 Get notified when the price drops  

            To get started:
            - Go to the site.
            - Track a product price

            You’ll get an alert when the price drops! 🎯
            `;
      break;
    case notification.NEW_PRODUCT:
      message = `
    ✅ *Product added!*

    I'm now tracking:
    📦 *${name}*

    🔔 You'll get a message when the price drops.
    `;
      break;

    case notification.ALERT_PRICE:
      const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

      let emphasis = "";
      if (discount >= 50) {
        emphasis = "🔥 Massive Deal!";
      } else if (discount >= 30) {
        emphasis = "⚡ Big Savings!";
      } else if (discount >= 10) {
        emphasis = "🔻 Price Drop!";
      } else {
        emphasis = "💸 Small Discount";
      }

      message = `
        ${emphasis}

        📦 *${name}*

        🔻 *Discount:* ${discount}%
        💰 *New Price:* $${newPrice}
        🛍️ *Old Price:* $${oldPrice}

        👉 [View Product](${url})
        `;

    default:
      message = "Something went wrong!";
      break;
  }

  return message;
}

export async function sendBotMessage(chatId: string, message: string) {
  const urlAPI = `https://api.telegram.org/bot${process.env.PRICETRACKER_BOT_API_KEY}/sendMessage`;

  axios
    .post(urlAPI, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    })
    .then(() => {
      console.log("Message sent!");
    })
    .catch((err) => {
      console.error(
        "Failed to send message:",
        err.response?.data || err.message
      );
    });
}
