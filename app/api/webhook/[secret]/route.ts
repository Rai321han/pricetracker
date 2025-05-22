import {
  addChatIdToUser,
  isUserExists,
} from "@/app/lib/actions/telegram-actions";
import { generateWelcomeUserMessage, sendBotMessage } from "@/app/lib/bot";
import { NextRequest, NextResponse } from "next/server";

type ParamsProps = { params: { secret: string } };

export async function POST(req: NextRequest, { params }: ParamsProps) {
  const { secret } = await params;

  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = await req.json();

    if (update.message?.text === "/start") {
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      const is_User_exits = await isUserExists(userId);
      let message = "";
      if (!is_User_exits) {
        message = await generateWelcomeUserMessage();
        await sendBotMessage(chatId, message);
        return NextResponse.json({ ok: true });
      }
      const updateCount = await addChatIdToUser(userId, chatId);
      if (!updateCount)
        return NextResponse.json({ error: "Cannot update the user" });
      message = await generateWelcomeUserMessage(userId);
      await sendBotMessage(chatId, message);
    }
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ ok: true });
}
