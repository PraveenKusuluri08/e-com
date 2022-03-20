export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isExists: boolean;
  profilePic: string;
  role: Role;
  buyed: Number;
};

enum Role {
  User,
  Admin,
  Product_Manager,
  Sales_Manager,
  Inventory_Manager,
  Discount_Manager,
}
