import { db } from "../config/admin";
import * as express from "express"

export const isAdmin =(req: any, res:express.Response, next:express.NextFunction) => {
  console.log("mhjhjhjkjk",req.user)
  const userRef = db.collection("USERS").doc(req.user).get();

  userRef
    .then((data:any) => {
      return data.data();
    })
    .then((info: any) => {
      if (info.role === 0) {
         return res
        .status(404)
        .json({ message: "You are not admin to access this content" });
      }
     return next()
    });
};
