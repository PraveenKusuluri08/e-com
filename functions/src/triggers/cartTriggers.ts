 import { db } from "../config/admin";
import * as firebaseFunctions from "firebase-functions";

export const updateProductCount = async (
  snap: firebaseFunctions.firestore.QueryDocumentSnapshot,
  context: firebaseFunctions.EventContext
) => {
  const prodId = snap.data().id

  db.collection("USERS").doc(prodId).collection("CART").where("id","==",prodId)
};

// export const updatePriceOfProduct = async (
//   snap:firebaseFunctions.firestore.QueryDocumentSnapshot,
//   context: firebaseFunctions.EventContext
// )=>{
//   const {uid,cartId}= context.params
//   (uid,cartId)
//  (snap.data())
// }