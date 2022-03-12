// import { db } from "../config/admin";
import * as firebaseFunctions from "firebase-functions";
export const updateProductCount = async (
  snap: firebaseFunctions.firestore.QueryDocumentSnapshot,
  context: firebaseFunctions.EventContext
) => {
  console.log(snap)
};

export const updatePriceOfProduct = async (
  snap:firebaseFunctions.firestore.QueryDocumentSnapshot,
  context: firebaseFunctions.EventContext
)=>{
  const {uid,cartId}= context.params
  console.log(uid,cartId)
 console.log(snap.data())
}