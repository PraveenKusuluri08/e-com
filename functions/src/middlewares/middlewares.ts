import { db } from "../config/admin";
import * as express from "express";

export const isAdmin = (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  const userRef = db.collection("USERS").doc(req.user).get();

  userRef
    .then((data: any) => {
      return data.data();
    })
    .then((info: any) => {
      console.log("info", info);
      if (info.role !== 1) {
        return res
          .status(404)
          .json({ message: "You are not admin to access this content" });
      }
      return next();
    });
};

export const isProductManager = (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  const userRef = db.collection("USERS").doc(req.user).get();

  userRef
    .then((data: any) => {
      return data.data();
    })
    .then((info: any) => {
      console.log("info", info);
      if (info.role !== 2) {
        return res
          .status(404)
          .json({ message: "You are not Product Manager to create product" });
      }
      return next();
    });
};

export const isSeller=(req:any,res:express.Response,next: express.NextFunction)=>{
  const userRef = db.collection("USERS").doc(req.user).get();

  userRef
    .then((data: any) => {
      return data.data();
    })
    .then((info: any) => {
      console.log("info", info);
      if (info.role !== 6) {
        return res
          .status(404)
          .json({ message: "You are not Seller to create product" });
      }
      return next();
    });
}
