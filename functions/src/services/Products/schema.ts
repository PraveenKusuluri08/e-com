export type ProductSchema = {
  productName: string;
  discription: string;
  details: object;
  images: Array<string>;
  price: number;
  quantity: number;
  category: string;
  isStockAvailable: boolean;
  isAdminApproved:boolean;
  review:Reviews
};


export type Reviews={
  message:string,
  rating:number,
}