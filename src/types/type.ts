export type Category = {
  name: string;
  order: number;
};

export type CartItem = {
  id: number;
  quantity: number;
  price: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: Category;
};

export type CheckOutItems = {
  id: number;
  createdAt: string;
  status: string;
  products: { id: number; quantity: number; product: Product }[];
};

export type HandleUpdateCart = (
  product: Product,
  quantity: number,
  type: "increment" | "decrement"
) => void;
