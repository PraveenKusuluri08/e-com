import * as functions from "firebase-functions";
import * as express from "express";
import Auth from "./services/Authentication/controller";
import * as cors from "cors";
import Products from "./services/Products/controller";
import Cart from "./services/Cart/controller";
import { db } from "./config/admin";
import User from "./services/User/controller";
import SendMails from "./helpers/mail";
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.use("/auth", Auth);
app.use("/products", Products);
app.use("/cart", Cart);

app.use("/user", User);

exports.app = functions.https.onRequest(app);

exports.pushApprovedProducts = functions.firestore
  .document("ADMIN-NOTIFICATIONS/{docId}")
  .onUpdate((snap, _) => {
    const after:any = snap.after.data();
    const previous = snap.before.data();
    if (after.approve) {
      return db
        .collection("PRODUCTS-NEED-TO-APPROVE")
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
            })
            .then(() => {
              return;
            })
            .catch((err: any) => {
              return err;
            });
        });
    }
    return previous;
  });

exports.onUserCreationOfAccount = functions.firestore
  .document("USERS/{uid}")
  .onCreate((snap, context) => {
    console.log(snap.data())
    const mailObject = {
      firstName: snap.data().firstName,
      lastName: snap.data().lastName,
      email: snap.data().email,
      profilePic: snap.data().profilePic,
      createdAt: snap.data().createdAt,
    };
    return SendMails.sendTemplateEmail(mailObject);
  });
