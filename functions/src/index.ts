import * as functions from "firebase-functions";
import * as express from "express";
import Auth from "./services/Authentication/controller";
import * as cors from "cors";
import Products from "./services/Products/controller";
import CartModel from "./services/Cart/controller";
import { db } from "./config/admin";
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.use("/auth", Auth);
app.use("/products", Products);
app.use("/cart", CartModel);

exports.app = functions.https.onRequest(app);

exports.pushApprovedProducts = functions.firestore
  .document("ADMIN-NOTIFICATIONS/{docId}")
  .onUpdate((snap, _) => {
    const after = snap.after.data();
    const previous = snap.before.data()
    if (after.approve) {
      return db.collection("PRODUCTS-NEED-TO-APPROVE")
        .doc(after.productId)
        .get()
        .then((snapData) => {
          return snapData.data();
        })
        .then((product) => {
          return db
            .collection("PRODUCTS")
            .doc(after.productId)
            .set(
              {
                ...product,
                isAdminApproved: true,
              },
              { merge: true }
            )
            .then(() => {
              return db
                .collection("PRODUCTS-NEED-TO-APPROVE")
                .doc(after.productId)
                .delete();
            }).then(()=>{
              return 
            })
            .catch((err: any) => {
              return err;
            });
        });
    }
    return previous
  });

//TODO:create a trigger if the product get reviewed then update the review to the products collection
