export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isExists: boolean;
  profilePic: string;
  role: RoleList["role"];
  buyed: Number;
  
};

type RoleList={
  role:[
    "Admin",
    "Product Manager",
    "Sales Manager",
    "User",
    "Inventory Manager",
    "Discount Manager"
  ]
}