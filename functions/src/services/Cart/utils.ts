import { db, admin } from "../../config/admin";

export class CartUtils {
  static async _is_Product_Exists(productId: string) {
    return db
      .collection("PRODUCTS")
      .where("productId", "==", productId)
      .where("isStockAvailable", "==", true)
      .limit(1)
      .get()
      .then((snap) => {
        if (snap.size < 0) throw new Error("Document not exists");
        else return snap.docs[0];
      });
  }
  static async _is_Product_Exists_In_Cart(productId: string, userId: string) {
    return db
      .collection("USERS")
      .doc(userId)
      .collection("CART")
      .where("id", "==", productId)
      .limit(1)
      .get()
      .then(async (snap) => {
        if (snap.size < 1) throw Error("Document not exists");
        else {
          const batch = db.batch();
          snap.forEach(async (doc) => {
            batch.update(doc.ref, {
              quantity: admin.firestore.FieldValue.increment(1),
            });
          });
          await batch.commit();
          console.log("Document count incremented");
        }
      })
      .catch((err) => {
        throw err;
      });
  }
  static async _is_cart_empty(userId: string, productId: string) {
    return db
      .collection("USERS")
      .doc(userId)
      .collection("CART")
      .where("id", "==", productId)
      .get()
      .then((res) => {
        console.log(res);
        if (res.size < 1) return true;
        else return false;
      });
  }
}
