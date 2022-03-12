import * as functions from "firebase-functions";
import * as express from "express";
import Auth from "./services/Authentication/controller";
import * as cors from "cors";
import Products from "./services/Products/controller";
import CartModel from "./services/Cart/controller";
import {updateProductCount } from "./triggers/cartTriggers";
const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.use("/auth", Auth);
app.use("/products", Products);
app.use("/cart", CartModel);

exports.app = functions.https.onRequest(app);

exports.updateProductCount = functions.firestore.document(
  "/USERS/{uid}/CART/{cartId}"
).onCreate((snap,context)=>{
  updateProductCount(snap,context)
})
