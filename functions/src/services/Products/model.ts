import { admin, db } from "../../config/admin";
import { ProductSchema, Reviews } from "./schema";
import { ProductUtils } from "./utils";
export class ProductModel {
  actionperformer: any;
  constructor(user: any) {
    this.actionperformer = user;
  }

  async _create_product(prodData: ProductSchema) {
    const productRef = db.collection("SELLER-PRODUCTS").doc();
    let total =
      prodData.actualPrice - (prodData.actualPrice * prodData.discount) / 100;
    let saving = prodData.actualPrice - total;
    return productRef
      .set(
        {
          ...prodData,
          createdAt: new Date().toISOString(),
          productId: productRef.id,
          isStockAvailable: prodData.quantity > 0 ? true : false,
          isAdminApproved: false,
          total: Number(total.toFixed(2)),
          isProductManagerApproved: false,
          saving,
        },
        { merge: true }
      )
      .then(() => {
        db.collection("PRODUCT-MANAGER-NOTIFICATIONS").doc().set(
          {
            message: "New Product is waiting to approve",
            productId: productRef.id,
            productCreatedAt: new Date().toISOString(),
            managerApprove: false,
            sellerId: this.actionperformer,
            productName: prodData.productName,
            actualPrice: prodData.actualPrice,
            discount: prodData.discount,
            productStock: prodData.quantity,
          },
          { merge: true }
        );
      })
      .catch((err) => {
        throw err;
      });
  }

  //TODO:this function is used for admin
  //TODO:If admin approve then it directly moves to the PRODUCTS collection
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

  //TODO:If product Manager apprvoes product then it directly moves to the PRODUCT-NEED-TO-APPROVE collection
  async _approve_products_product_manager(productId: string) {
    return db
      .collection("PRODUCT-MANAGER-NOTIFICATIONS")
      .where("productId", "==", productId)
      .get()
      .then(async (data) => {
        const batch = db.batch();
        data.forEach((doc) => {
          batch.update(doc.ref, {
            managerApprove: true,
          });
        });
        await batch.commit();
        console.log("Product approve by product manager");
      })
      .catch((err) => {
        throw err;
      });
  }

  async _review_product(productID: string, reviews: Reviews) {
    console.log(
      "dsfds",
      await ProductUtils._check_user_already_reviewed(
        this.actionperformer,
        productID
      )
    );
    if (
      !(await ProductUtils._check_user_already_reviewed(
        this.actionperformer,
        productID
      ))
    ) {
      return (
        db
          .collection("PRODUCTS")
          .doc(productID)
          .set(
            {
              reviews: admin.firestore.FieldValue.arrayUnion({
                ...reviews,
                user: this.actionperformer,
              }),
            },
            { merge: true }
          )
          .then(() => {
            //TODO:Send email notification
            const adminRef = db.collection("ADMIN-NOTIFICATIONS").doc();
            adminRef.set(
              {
                ...reviews,
                productID: productID,
                reviewAt: new Date().toISOString(),
                content: `Someone reviewed your product`,
                id: adminRef.id,
                topic: "PRODUCT-REVIEWS",
                uid: this.actionperformer,
              },
              { merge: true }
            );
          })
          // .then(() => {
          //   //SEND MAIL TO THE ADMIN ACCOUNT
          //   return;
          // })
          .catch((err) => {
            throw err;
          })
      );
    } else {
      throw "Oops!! you already reviewed! if you want to review again then delete previous review";
    }
  }
  async get_product_by_category(category: string, depeartment: string) {
    return db
      .collection("PRODUCTS")
      .where("category", "==", category)
      .where("depeartment", "==", depeartment)
      .get()
      .then((data) => {
        return data.docs.forEach((doc) => {
          doc.data();
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  //TODO:Use geo-fire and query the data for nearest price range
  async get_products_by_price(price: number) {
    console.log(price);
    let products: any = [];
    return db
      .collection("PRODUCTS")
      .where("category", "==", "electronics")
      .where("price", "<=" && ">=", price)
      .get()
      .then((snap) => {
        snap.docs.forEach((doc) => {
          products.push(doc.data());
        });
        return products;
      })
      .catch((err) => {
        throw err;
      });
  }

  async request_stock(productId: string): Promise<void> {
    let requestStockRef = db.collection("REQUEST-STOCK").doc();
    let users = [];

    users.push(this.actionperformer);
    if (!(await ProductUtils.is_out_of_stock(productId))) {
      //TODO:Update the frontend application link here,then user can directly navigate to the product page
      throw new Error("Product is available please check the product");
    } else {
      requestStockRef
        .set({
          lastRequest: new Date().toISOString(),
          users,
          usersLength: users.length,
          message: "Product stock required",
          productId,
          docId: requestStockRef.id,
        })
        .catch((err) => {
          throw err;
        });
    }
  }
}
