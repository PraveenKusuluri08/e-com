export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  conformPassword: string;
  isExists: boolean;
  profilePic: string;
  role: Role;
  buyed: Number;
  mobile:number
};

enum Role {
  User,
  Admin,
  Product_Manager,
  Sales_Manager,
  Inventory_Manager,
  Discount_Manager,
  Seller,
}
