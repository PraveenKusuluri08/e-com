import { db } from "../../config/admin";

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
}
