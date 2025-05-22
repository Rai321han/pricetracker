import axios from "axios";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";

type Data = {
  name: string;
  url: string;
  newPrice: number;
  oldPrice: number;
};

export async function generateAlertMessage(data: Data) {
  let message = "";
  const { name, oldPrice, newPrice, url } = data;

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

  return message;
}

export async function generateWelcomeUserMessage(userId?: number) {
  let message = "";
  if (userId) {
    connectToDB();
    const user = await User.findOne({ userId }, { products: 1 }); // Only fetch products
    if (!user || !user.products)
      return "Welcome. We couldn't find any products associated with this account.";
    message = `👋 Welcome back!

You're currently tracking 🛒 *${user.products.length} product(s)*. ${user.products.length > 0 ? "I'll keep an eye on them and alert you when the prices drop! 📉" : ""}

Here’s what you can do:
🔹 Add more products to track  
🔹 Get notified instantly when prices fall

To manage or add new tracked products:
- Visit the website (https://db94-103-113-173-3.ngrok-free.app)
- Start tracking more deals!

Happy saving! 💰`;
    return message;
  }
  // message = `
  // 👋 *Welcome to Price Tracker Bot!*

  // Currently, you are not tracking any product.
  // Here's what you can do:

  // 🔹 Add a product to track
  // 🔹 Get notified when the price drops

  // To get started:
  // - Go to the site.
  // - Track a product price

  // You’ll get an alert when the price drops! 🎯
  // `;

  message = `
A bot is replying to you now. 
More features are comming soon...
  
Developed by *Raihan Uddin*
  `;

  return message;
}

export async function sendBotMessage(chatId: number, message: string) {
  console.log(message);
  const urlAPI = `https://api.telegram.org/bot${process.env.PRICETRACKER_BOT_API_KEY}/sendMessage`;

  try {
    await axios.post(urlAPI, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
    console.log("Message sent!");
  } catch (error) {
    console.error("Failed to send message!", error);
  }
}
