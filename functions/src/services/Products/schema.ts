export type ProductSchema = {
  productName: string;
  discription: string;
  details: object;
  images: Array<string>;
  quantity: number;
  category: string;
  isStockAvailable: boolean;
  isAdminApproved: boolean;
  reviews: Array<Reviews>;
  depeartment:string;
  actualPrice: number;
  discount: number;
  total:number;
  saving:number;
  isProductManagerApproved:false
};

export type Reviews = {
  message: string;
  rating: number;
};
