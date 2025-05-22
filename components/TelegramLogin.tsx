"use client"; // If you're using Next.js 13+ with the app directory

import { useEffect } from "react";
import { TelegramUser } from "@/types";
import { saveUserToDatabase } from "@/app/lib/actions";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export default function TelegramLogin() {
  useEffect(() => {
    window.onTelegramAuth = async function (user: TelegramUser) {
      // save the userId to database
      try {
        await saveUserToDatabase(user);
      } catch (error) {
        console.log(error);
      }
      // when a user command /start on the bot
      // our app check if this user has any product trakable, if so, add this chatId to all the products

      // now we are okay to do all the things
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "pricetrackerapp_bot"); // No @
    script.setAttribute("data-size", "large");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");

    document.getElementById("telegram-login-widget")?.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
      const container = document.getElementById("telegram-login-widget");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return <div id="telegram-login-widget" />;
}
