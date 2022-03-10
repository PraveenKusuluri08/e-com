export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isExists: boolean;
  profilePic: string;
  role: Number;
  cart: Array<CartData>;
};

type CartData = {
  id: string;
  productName: string;
  boughtAt: string;
};
