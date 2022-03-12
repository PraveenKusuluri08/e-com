import { db } from "../../config/admin";
import { CartData } from "./schema";
// import { ProductSchema } from "../Products/schema";
import { CartUtils } from "./utils";

export class CartModel {
  actionperformer: string;
  constructor(user: string) {
    this.actionperformer = user;
  }
  async _add_to_cart(productData: CartData) {

        CartUtils._is_Product_Exists(productData.id).then((data: any) => {
          console.log(data);
          const cartref = db.collection("USERS").doc(this.actionperformer);
          cartref
            .collection("CART")
            .doc()
            .set(
              {
                ...productData,
                addedAt: new Date().toISOString(),
                isProductExists: true,
                count:1,
              },
              { merge: true }
            )
            .catch((error) => {
              throw error
            })
      }
    );
  }
}
