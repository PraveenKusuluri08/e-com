import { db } from "../../config/admin";

export class CartUtils {
  static async _is_Product_Exists(productId: string) {
    console.log(productId);
    new Promise(
      (resolve: (data: object) => any, reject: (error: string) => any) => {
        return db
          .collection("PRODUCTS")
          .where("productId", "==", productId)
          .where("isStockAvailable", "==", true)
          .get()
          .then((snap) => {
            if (snap.size < 0) reject("Product is out of stock!");
            else resolve(snap.docs[0].data());
          });
      }
    );
  } 
}
