export type ProductSchema = {
  productName: string;
  discription: string;
  details: object;
  images: Array<string>;
  rating: number;
  price: number;
  quantity: number;
  category: string;
  isStockAvailable: boolean;
  isAdminApproved:boolean;
};
