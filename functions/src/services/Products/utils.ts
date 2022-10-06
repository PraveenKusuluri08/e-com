import { db } from "../../config/admin"

export class ProductUtils {
  static async _check_user_already_reviewed(email: string, productId: string) {
    console.log(email)
    return db
      .collection("PRODUCTS")
      .doc(productId)
      .get()
      .then((snap) => {
        return snap.data()
      })
      .then((data: any) => {
        let reviews = data.reviews
        return !!reviews.find((review: any) => review.user === email)
      })
  }
  static async _check_product_exists(productId: String) {
    return db
      .collection("PRODUCTS")
      .where("productId", "==", productId)
      .where("isProductManagerApproved", "==", true)
      .where("isAdminApproved", "==", true)
      .where("isStockAvailable", "==", true)
      .get()
      .then((snap) => {
        if (snap.size < 0) {
          throw new Error("product-not-found")
        }
        return snap.docs[0].data()
      })
      .catch((err) => {
        throw err
      })
  }
}
