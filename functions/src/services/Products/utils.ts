import { db } from "../../config/admin";

type dbRef = {
  productId: string;
  isProductManagerApproved: boolean;
  total: number;
  productName: string;
};
export class ProductUtils {
  static async _check_user_already_reviewed(email: string, productId: string) {
    console.log(email);
    return db
      .collection("PRODUCTS")
      .doc(productId)
      .get()
      .then((snap) => {
        return snap.data();
      })
      .then((data: any) => {
        let reviews = data.reviews;
        return !!reviews.find((review: any) => review.user === email);
      });
  }
  static async is_out_of_stock(productId: string) {
    console.log("ProductId", productId);
    return db
      .collection("PRODUCTS")
      .where("productId", "==", productId)
      .onSnapshot((snap) => {
        snap.docs.forEach(
          (doc) => {
            if (doc.data().quantity < 1) return true;
            return false;
          },
          (err: Error) => {
            throw err;
          }
        );
      });
  }
  static async _get_product_data(productId: string): Promise<void> {
    db.collection("PRODUCTS")
      .where("productId", "==", productId)
      .onSnapshot(
        (snap) => {
          snap.docs.forEach((doc) => {
            return doc.data();
          });
        },
        (err: Error) => {
          throw err;
        }
      );
  }
}
