"use server";
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { TelegramUser, TUser } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { createHash, createHmac } from "crypto";
import { redirect } from "next/navigation";
import User from "../models/user.model";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDB();
    const scrapeProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapeProduct) return;

    let product = scrapeProduct;

    const existingProduct = await Product.findOne({ url: scrapeProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapeProduct.currentPrice },
      ];

      product = {
        ...scrapeProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapeProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
    redirect(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();
    const currentProducts = await Product.findById(productId);
    if (!currentProducts) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userExists = product.users.some(
      (user: TUser) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");
      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}

const checkUserTelegramData = function (userData: TelegramUser) {
  // making the secret key from token
  const secret_key = createHash("sha256")
    .update(`${process.env.PRICETRACKER_BOT_API_KEY}`)
    .digest();

  // making of data_check_string
  const data_check_string = Object.entries(userData)
    .filter(([key]) => key !== "hash") // remove the 'hash' field
    .sort(([a], [b]) => a.localeCompare(b)) // sort by key
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  //validation
  if (
    createHmac("sha256", secret_key).update(data_check_string).digest("hex")
  ) {
    return true;
  } else return false;
};

export const saveUserToDatabase = async function (userData: TelegramUser) {
  if (!checkUserTelegramData(userData)) {
    console.log("Invalid telegram data");
    return;
  }

  try {
    connectToDB();
    await User.findOneAndUpdate(
      { userId: userData.id },
      {
        $set: {
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
          authDate: userData.auth_date,
          hash: userData.hash,
        },
        $setOnInsert: {
          chatId: null,
          products: [],
          userId: userData.id,
        },
      },
      { upsert: true, new: true }
    );
    //sendBotMessage
  } catch (error) {
    console.log(error);
  }
};
