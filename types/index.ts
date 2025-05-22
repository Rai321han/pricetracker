export type PriceHistoryItem = {
  price: number;
};

export type TUser = {
  email: string;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: boolean;
  users?: TUser[];
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

export type User = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  authDate: number;
  hash: string;
};
