import { admin, db } from "../../config/admin";
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
      if (
        await CartUtils._is_cart_empty(this.actionperformer, productData.id)
      ) {
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
            amount: data.total,
            saving: data.saving,
            discount: data.discount,
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

  async _decrement_quantity(prodId: string) {
    if (
      await CartUtils._is_product_exists_in_cart(prodId, this.actionperformer)
    ) {
      return db
        .collection("USERS")
        .doc(this.actionperformer)
        .collection("CART")
        .where("id", "==", prodId)
        .get()
        .then((snap) => {
          const batch = db.batch();
          snap.docs.forEach((doc) => {
            batch.update(doc.ref, {
              quantity: admin.firestore.FieldValue.increment(-1),
            });
          });
          batch.commit();
          console.log("Quantity decremented successfully");
        })
        .catch((err) => {
          throw err;
        });
    } else {
    }
  }

  async _delete_product_in_cart(productId: string) {
    if (
      await CartUtils._is_product_exists_in_cart(
        productId,
        this.actionperformer
      )
    ) {
      return await db
        .collection("USERS")
        .doc(this.actionperformer)
        .collection("CART")
        .where("id", "==", productId)
        .get()
        .then(async (snap) => {
          const batch = db.batch();
          snap.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          console.log("Product deleted from cart");
        })
        .catch((err) => {
          throw err;
        });
    } else {
      throw "Something went wrong please check is product exists";
    }
  }
  //TODO:Add the the grand total endpoint to caluclate
  //TODO:the price of all products in the cart

  async _get_grand_total() {
    return db
      .collection("USERS")
      .doc(this.actionperformer)
      .collection("CART")
      .get()
      .then((snap) => {
        return snap.docs;
      })
      .then((snapDoc) => {
        let grand_total = 0;
        snapDoc.forEach((doc) => {
          grand_total += doc.data().amount;
        });
        return grand_total;
      })
      .catch((err) => {
        throw err;
      });
  }
}
