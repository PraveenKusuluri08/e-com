import { db} from "../../config/admin";
import { ProductSchema } from "./schema";

export class ProductModel {
  actionperformer: any;
  constructor(user: any) {
    this.actionperformer = user;
    console.log(this.actionperformer)
  }
  async _create_product(prodData: ProductSchema) {
    const productRef = db.collection("PRODUCTS").doc();

    return productRef
      .set(
        {
          ...prodData,
          createdAt: new Date().toISOString(),
          productId: productRef.id,
        },
        { merge: true }
      )
      .catch((err) => {
        throw err;
      });
  }
}
