import { db } from "../../config/admin";
import { ProductSchema } from "./schema";

export class ProductModel {
  actionperformer: any;
  constructor(user: any) {
    this.actionperformer = user;
  }
  async _create_product(prodData: ProductSchema) {
    const productRef = db.collection("PRODUCTS-NEED-TO-APPROVE").doc();

    return productRef
      .set(
        {
          ...prodData,
          createdAt: new Date().toISOString(),
          productId: productRef.id,
          isStockAvailable: prodData.quantity > 0 ? true : false,
        },
        { merge: true }
      )
      .then(() => {
        db.collection("ADMIN-NOTIFICATIONS").doc().set(
          {
            message: "New Product is waiting to approve",
            productId: productRef.id,
            productCreatedAt: new Date().toISOString(),
            approve: false,
          },
          { merge: true }
        );
      })
      .catch((err) => {
        throw err;
      });
  }

  async _approve_products(productId: string) {
    return db
      .collection("ADMIN-NOTIFICATIONS")
      .where("productId", "==", productId)
      .get()
      .then(async (snap) => {
        const batch = db.batch();
        snap.forEach((doc) => {
          batch.update(doc.ref, {
            approve: true,
          });
        });
        await batch.commit();
        console.log("Product Approved");
      })
      .catch((err: any) => {
        throw err;
      });
  }
}
