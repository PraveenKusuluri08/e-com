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
    CartUtils._is_Product_Exists(productData.id).then(async (data: any) => {
      console.log(await CartUtils._is_cart_empty(this.actionperformer,productData.id))
        if (await CartUtils._is_cart_empty(this.actionperformer,productData.id)) {
          const cartref = await db
            .collection("USERS")
            .doc(this.actionperformer)
            .collection("CART")
            .doc();
          await cartref
            .set({
              ...productData,
              addedAt: new Date().toISOString(),
              isProductExists: true,
              quantity: 1,
              docId: cartref.id,
            })
            .catch((error) => {
              throw error;
            });
        } else {
          CartUtils._is_Product_Exists_In_Cart(
            productData.id,
            this.actionperformer
          )
            .then((res) => {
              console.log("zdfksdigudfivutuybirtjybetdyobet", res);
              return "Document updated";
            })
            .catch((err) => {
              return err;
            });
        }
    });
  }
}
