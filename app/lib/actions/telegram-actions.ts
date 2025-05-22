
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";

export async function isUserExists(userId: number) {
  try {
    connectToDB();
    const user = await User.findOne({
      userId,
    });
    if (!user) return false;
    else return true;
  } catch (error) {
    console.log(error);
  }
}

export async function addChatIdToUser(userId: number, chatId: number) {
  try {
    connectToDB();
    const user = await User.findOne({ userId });
    if (!user) throw new Error("user not found");
    if (user.chatId) {
      return 1;
    }
    const updateResult = await User.updateOne({ userId }, { chatId });
    const products = user?.products;
    for (const productId of products) {
      await Product.updateOne(
        {
          _id: productId,
          "users.userId": userId, // 🔥 This is where we match the correct user
        },
        {
          $set: {
            "users.$.chatId": chatId, // 🔄 This sets chatId for the matched user
          },
        }
      );
    }

    return updateResult.modifiedCount || 0;
  } catch (error) {
    console.log(error);
  }
}
