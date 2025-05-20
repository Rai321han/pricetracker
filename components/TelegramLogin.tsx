"use client"; // If you're using Next.js 13+ with the app directory

import { useEffect } from "react";

export default function TelegramLogin() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "pricetrackerapp_bot"); // No @
    script.setAttribute("data-size", "large");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth");

    document.getElementById("telegram-login-widget")?.appendChild(script);

    // window.onTelegramAuth = function (user) {
    //   console.log("Telegram user:", user);

    //   // Send user info to your backend (optional)
    //   fetch("/api/telegram-auth", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(user),
    //   });
    // };
  }, []);

  return <div id="telegram-login-widget" />;
}
